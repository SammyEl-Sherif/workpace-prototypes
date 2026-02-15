import { querySupabase } from '@/db'
import { Contract, CreateContractInput } from '@/interfaces/portal'
import { getDocuSignClient } from '@/apis/controllers/docusign/oauth'

export const ContractsService = {
  async getByOrgId(orgId: string): Promise<Contract[]> {
    return querySupabase<Contract>('contracts/get_by_org_id.sql', [orgId])
  },

  async getById(id: string): Promise<Contract | null> {
    const results = await querySupabase<Contract>('contracts/get_by_id.sql', [id])
    return results.length > 0 ? results[0] : null
  },

  async getByEnvelopeId(envelopeId: string): Promise<Contract | null> {
    const results = await querySupabase<Contract>('contracts/get_by_envelope_id.sql', [envelopeId])
    return results.length > 0 ? results[0] : null
  },

  async create(orgId: string, userId: string, input: CreateContractInput): Promise<Contract> {
    const results = await querySupabase<Contract>('contracts/create.sql', [
      orgId,
      input.title,
      input.signing_method,
      input.template_id || null,
      input.document_url || null,
      input.signer_email,
      input.signer_name,
      userId,
    ])
    if (results.length === 0) {
      throw new Error('Failed to create contract')
    }
    return results[0]
  },

  async createAndSendEnvelope(orgId: string, contractId: string): Promise<Contract> {
    const contract = await this.getById(contractId)
    if (!contract) {
      throw new Error('Contract not found')
    }

    if (contract.status !== 'draft') {
      throw new Error('Contract must be in draft status to send')
    }

    const { accessToken, accountId, baseUri } = await getDocuSignClient(orgId)

    let envelopeBody: Record<string, unknown>

    if (contract.template_id) {
      // Template-based envelope
      envelopeBody = {
        templateId: contract.template_id,
        templateRoles: [
          {
            email: contract.signer_email,
            name: contract.signer_name,
            roleName: 'Signer',
          },
        ],
        status: 'sent',
      }
    } else if (contract.document_url) {
      // PDF-based envelope — fetch document and send as base64
      const docResponse = await fetch(contract.document_url)
      if (!docResponse.ok) {
        throw new Error('Failed to fetch document for envelope')
      }
      const docBuffer = await docResponse.arrayBuffer()
      const base64Doc = Buffer.from(docBuffer).toString('base64')

      envelopeBody = {
        documents: [
          {
            documentBase64: base64Doc,
            name: contract.title,
            fileExtension: 'pdf',
            documentId: '1',
          },
        ],
        recipients: {
          signers: [
            {
              email: contract.signer_email,
              name: contract.signer_name,
              recipientId: '1',
              routingOrder: '1',
              tabs: {
                signHereTabs: [
                  {
                    documentId: '1',
                    pageNumber: '1',
                    anchorString: '/sig/',
                    anchorUnits: 'pixels',
                    anchorXOffset: '0',
                    anchorYOffset: '0',
                  },
                ],
              },
            },
          ],
        },
        status: 'sent',
      }
    } else {
      throw new Error('Contract must have either a template_id or document_url')
    }

    const response = await fetch(`${baseUri}/v2.1/accounts/${accountId}/envelopes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(envelopeBody),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[ContractsService] Failed to create envelope:', {
        status: response.status,
        error: errorText,
      })
      throw new Error('Failed to create DocuSign envelope')
    }

    const envelopeData = await response.json()
    const envelopeId = envelopeData.envelopeId

    const results = await querySupabase<Contract>('contracts/update_envelope.sql', [
      contractId,
      envelopeId,
    ])

    if (results.length === 0) {
      throw new Error('Failed to update contract with envelope details')
    }

    return results[0]
  },

  async getSigningUrl(orgId: string, contractId: string, returnUrl: string): Promise<string> {
    const contract = await this.getById(contractId)
    if (!contract) {
      throw new Error('Contract not found')
    }

    if (contract.status !== 'sent' || !contract.envelope_id) {
      throw new Error('Contract must be sent to get signing URL')
    }

    const { accessToken, accountId, baseUri } = await getDocuSignClient(orgId)

    const response = await fetch(
      `${baseUri}/v2.1/accounts/${accountId}/envelopes/${contract.envelope_id}/views/recipient`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          returnUrl,
          authenticationMethod: 'none',
          email: contract.signer_email,
          userName: contract.signer_name,
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[ContractsService] Failed to get signing URL:', {
        status: response.status,
        error: errorText,
      })
      throw new Error('Failed to get DocuSign signing URL')
    }

    const data = await response.json()
    return data.url
  },

  async updateStatusFromWebhook(
    envelopeId: string,
    status: string,
    signedAt: string | null
  ): Promise<Contract | null> {
    const contract = await this.getByEnvelopeId(envelopeId)
    if (!contract) {
      return null
    }

    const results = await querySupabase<Contract>('contracts/update_status.sql', [
      contract.id,
      status,
      signedAt,
    ])

    return results.length > 0 ? results[0] : null
  },

  async revise(contractId: string, orgId: string, userId: string): Promise<Contract> {
    const original = await this.getById(contractId)
    if (!original) {
      throw new Error('Contract not found')
    }

    // Void previous versions
    await querySupabase('contracts/void_previous_versions.sql', [orgId, original.title, contractId])

    // Create new version
    const results = await querySupabase<Contract>('contracts/create.sql', [
      orgId,
      original.title,
      original.signing_method,
      original.template_id || null,
      original.document_url || null,
      original.signer_email,
      original.signer_name,
      userId,
    ])

    if (results.length === 0) {
      throw new Error('Failed to create revised contract')
    }

    return results[0]
  },
}
