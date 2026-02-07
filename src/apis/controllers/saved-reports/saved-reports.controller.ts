import { NextApiRequest, NextApiResponse } from 'next'

import { SavedReportsService } from './saved-reports.service'
import { CreateSavedReportInput, UpdateSavedReportInput } from '@/interfaces/saved-reports'
import { HttpResponse } from '@/server/types'
import { withSupabaseAuth } from '@/server/utils'

export const getSavedReportsController = withSupabaseAuth(
  async (
    req: NextApiRequest,
    res: NextApiResponse<HttpResponse<{ saved_reports: any[] }>>,
    session
  ) => {
    try {
      if (!session.user) {
        res.status(401).json({
          data: { saved_reports: [] },
          status: 401,
        })
        return
      }
      const userId = session.user.id
      const savedReports = await SavedReportsService.getAll(userId)

      res.status(200).json({
        data: { saved_reports: savedReports },
        status: 200,
      })
    } catch (error: unknown) {
      res.status(500).json({
        data: { saved_reports: [] },
        status: 500,
      })
    }
  }
)

export const getSavedReportByIdController = withSupabaseAuth(
  async (
    req: NextApiRequest,
    res: NextApiResponse<HttpResponse<{ saved_report: any | null }>>,
    session
  ) => {
    try {
      if (!session.user) {
        res.status(401).json({
          data: { saved_report: null },
          status: 401,
        })
        return
      }
      const { id } = req.query
      const userId = session.user.id

      if (!id || typeof id !== 'string') {
        res.status(400).json({
          data: { saved_report: null },
          status: 400,
        })
        return
      }

      const savedReport = await SavedReportsService.getById(id, userId)

      if (!savedReport) {
        res.status(404).json({
          data: { saved_report: null },
          status: 404,
        })
        return
      }

      res.status(200).json({
        data: { saved_report: savedReport },
        status: 200,
      })
    } catch (error: unknown) {
      res.status(500).json({
        data: { saved_report: null },
        status: 500,
      })
    }
  }
)

export const createSavedReportController = withSupabaseAuth(
  async (
    req: NextApiRequest,
    res: NextApiResponse<HttpResponse<{ saved_report: any }>>,
    session
  ) => {
    try {
      if (!session.user) {
        res.status(401).json({
          data: { saved_report: null },
          status: 401,
        })
        return
      }
      const userId = session.user.id
      const input: CreateSavedReportInput = req.body

      if (!input.title || !input.content) {
        res.status(400).json({
          data: { saved_report: null },
          status: 400,
        })
        return
      }

      const savedReport = await SavedReportsService.create(userId, input)

      res.status(201).json({
        data: { saved_report: savedReport },
        status: 201,
      })
    } catch (error: unknown) {
      res.status(500).json({
        data: { saved_report: null },
        status: 500,
      })
    }
  }
)

export const updateSavedReportController = withSupabaseAuth(
  async (
    req: NextApiRequest,
    res: NextApiResponse<HttpResponse<{ saved_report: any }>>,
    session
  ) => {
    try {
      if (!session.user) {
        res.status(401).json({
          data: { saved_report: null },
          status: 401,
        })
        return
      }
      const { id } = req.query
      const userId = session.user.id
      const input: UpdateSavedReportInput = req.body

      if (!id || typeof id !== 'string') {
        res.status(400).json({
          data: { saved_report: null },
          status: 400,
        })
        return
      }

      const savedReport = await SavedReportsService.update(id, userId, input)

      res.status(200).json({
        data: { saved_report: savedReport },
        status: 200,
      })
    } catch (error: unknown) {
      const statusCode = error instanceof Error && error.message?.includes('not found') ? 404 : 500
      res.status(statusCode).json({
        data: { saved_report: null },
        status: statusCode,
      })
    }
  }
)

export const deleteSavedReportController = withSupabaseAuth(
  async (req: NextApiRequest, res: NextApiResponse<HttpResponse<null>>, session) => {
    try {
      if (!session.user) {
        res.status(401).json({
          data: null,
          status: 401,
        })
        return
      }
      const { id } = req.query
      const userId = session.user.id

      if (!id || typeof id !== 'string') {
        res.status(400).json({
          data: null,
          status: 400,
        })
        return
      }

      await SavedReportsService.delete(id, userId)

      res.status(200).json({
        data: null,
        status: 200,
      })
    } catch (error: unknown) {
      const statusCode = error instanceof Error && error.message?.includes('not found') ? 404 : 500
      res.status(statusCode).json({
        data: null,
        status: statusCode,
      })
    }
  }
)
