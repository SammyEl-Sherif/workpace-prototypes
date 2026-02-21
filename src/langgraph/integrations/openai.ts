import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function draftScopeOfWork(intakeData: Record<string, unknown>): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `You are a consulting proposal writer for a Notion Workspace consulting business.
Given a client's intake form responses, draft a concise scope-of-work document that covers:
1. Project Overview
2. Key Deliverables
3. Timeline Estimate
4. Assumptions & Dependencies

Keep it professional, clear, and under 1000 words.`,
      },
      {
        role: 'user',
        content: `Draft a scope-of-work based on these intake form responses:\n\n${JSON.stringify(
          intakeData,
          null,
          2
        )}`,
      },
    ],
    temperature: 0.7,
    max_tokens: 2000,
  })

  return response.choices[0]?.message?.content ?? 'Failed to generate scope of work.'
}
