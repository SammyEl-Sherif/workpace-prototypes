import { NextApiRequest, NextApiResponse } from 'next'

import {
  getGoodThingsController,
  getGoodThingByIdController,
  createGoodThingController,
  updateGoodThingController,
  deleteGoodThingController,
  bulkCreateGoodThingsController,
} from '@/apis/controllers'

export const getGoodThingsRoute = getGoodThingsController

export const getGoodThingByIdRoute = getGoodThingByIdController

export const createGoodThingRoute = createGoodThingController

export const updateGoodThingRoute = updateGoodThingController

export const deleteGoodThingRoute = deleteGoodThingController

export const bulkCreateGoodThingsRoute = bulkCreateGoodThingsController
