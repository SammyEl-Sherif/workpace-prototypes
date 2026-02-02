import { NextApiRequest, NextApiResponse } from 'next'

import { SavedReportsService } from './saved-reports.service'
import {
  CreateSavedReportInput,
  UpdateSavedReportInput,
} from '@/interfaces/saved-reports'
import { HttpResponse } from '@/server/types'
import { withSupabaseAuth } from '@/server/utils'

export const getSavedReportsController = withSupabaseAuth(
  async (
    req: NextApiRequest,
    res: NextApiResponse<HttpResponse<{ saved_reports: any[] }>>,
    session
  ) => {
    try {
      const userId = session.user.id
      const savedReports = await SavedReportsService.getAll(userId)

      res.status(200).json({
        data: { saved_reports: savedReports },
        status: 200,
      })
    } catch (error: any) {
      res.status(500).json({
        data: { saved_reports: [] },
        status: 500,
        error: error.message || 'Failed to fetch saved reports',
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
      const { id } = req.query
      const userId = session.user.id

      if (!id || typeof id !== 'string') {
        res.status(400).json({
          data: { saved_report: null },
          status: 400,
          error: 'Saved report ID is required',
        })
        return
      }

      const savedReport = await SavedReportsService.getById(id, userId)

      if (!savedReport) {
        res.status(404).json({
          data: { saved_report: null },
          status: 404,
          error: 'Saved report not found',
        })
        return
      }

      res.status(200).json({
        data: { saved_report: savedReport },
        status: 200,
      })
    } catch (error: any) {
      res.status(500).json({
        data: { saved_report: null },
        status: 500,
        error: error.message || 'Failed to fetch saved report',
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
      const userId = session.user.id
      const input: CreateSavedReportInput = req.body

      if (!input.title || !input.content) {
        res.status(400).json({
          data: { saved_report: null },
          status: 400,
          error: 'Title and content are required',
        })
        return
      }

      const savedReport = await SavedReportsService.create(userId, input)

      res.status(201).json({
        data: { saved_report: savedReport },
        status: 201,
      })
    } catch (error: any) {
      res.status(500).json({
        data: { saved_report: null },
        status: 500,
        error: error.message || 'Failed to create saved report',
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
      const { id } = req.query
      const userId = session.user.id
      const input: UpdateSavedReportInput = req.body

      if (!id || typeof id !== 'string') {
        res.status(400).json({
          data: { saved_report: null },
          status: 400,
          error: 'Saved report ID is required',
        })
        return
      }

      const savedReport = await SavedReportsService.update(id, userId, input)

      res.status(200).json({
        data: { saved_report: savedReport },
        status: 200,
      })
    } catch (error: any) {
      const statusCode = error.message?.includes('not found') ? 404 : 500
      res.status(statusCode).json({
        data: { saved_report: null },
        status: statusCode,
        error: error.message || 'Failed to update saved report',
      })
    }
  }
)

export const deleteSavedReportController = withSupabaseAuth(
  async (
    req: NextApiRequest,
    res: NextApiResponse<HttpResponse<null>>,
    session
  ) => {
    try {
      const { id } = req.query
      const userId = session.user.id

      if (!id || typeof id !== 'string') {
        res.status(400).json({
          data: null,
          status: 400,
          error: 'Saved report ID is required',
        })
        return
      }

      await SavedReportsService.delete(id, userId)

      res.status(200).json({
        data: null,
        status: 200,
      })
    } catch (error: any) {
      const statusCode = error.message?.includes('not found') ? 404 : 500
      res.status(statusCode).json({
        data: null,
        status: statusCode,
        error: error.message || 'Failed to delete saved report',
      })
    }
  }
)
