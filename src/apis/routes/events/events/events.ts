import {
  getEventsController,
  getEventByIdController,
  createEventController,
  updateEventController,
  deleteEventController,
  addEventGuestsController,
  sendEventInvitesController,
} from '@/apis/controllers'

export const getEventsRoute = getEventsController

export const getEventByIdRoute = getEventByIdController

export const createEventRoute = createEventController

export const updateEventRoute = updateEventController

export const deleteEventRoute = deleteEventController

export const addEventGuestsRoute = addEventGuestsController

export const sendEventInvitesRoute = sendEventInvitesController
