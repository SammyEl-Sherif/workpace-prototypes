import { NextApiRequest, NextApiResponse } from 'next'

import {
  getSavedReportsController,
  getSavedReportByIdController,
  createSavedReportController,
  updateSavedReportController,
  deleteSavedReportController,
} from '@/apis/controllers'

export const getSavedReportsRoute = getSavedReportsController

export const getSavedReportByIdRoute = getSavedReportByIdController

export const createSavedReportRoute = createSavedReportController

export const updateSavedReportRoute = updateSavedReportController

export const deleteSavedReportRoute = deleteSavedReportController
