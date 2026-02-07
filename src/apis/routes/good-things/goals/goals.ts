import { NextApiRequest, NextApiResponse } from 'next'

import {
  getGoalsController,
  getGoalByIdController,
  createGoalController,
  updateGoalController,
  deleteGoalController,
} from '@/apis/controllers'

export const getGoalsRoute = getGoalsController

export const getGoalByIdRoute = getGoalByIdController

export const createGoalRoute = createGoalController

export const updateGoalRoute = updateGoalController

export const deleteGoalRoute = deleteGoalController
