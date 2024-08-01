import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

import { HttpMethod } from '@/interfaces/httpMethod'

type RequestHandler = (req: NextApiRequest, res: NextApiResponse) => Promise<void>

export class ServerException extends Error {
  constructor(message: string, public statusCode = 400, public data?: unknown) {
    super(message)
  }
}

export const apiRequestWrapper = (
  handler: RequestHandler | Partial<Record<HttpMethod, RequestHandler>>
): NextApiHandler => {
  return async (request: NextApiRequest, response: NextApiResponse) => {
    try {
      const methodHandler = resolveMethodHandler(handler, request, response)
      await methodHandler(request, response)
    } catch (error) {
      const message = 'Internal Server Error'
      const statusCode = 500
      let data
      response.status(statusCode).json({
        message,
        data,
      })
    }
  }
}

function resolveMethodHandler(
  handler: RequestHandler | Partial<Record<HttpMethod, RequestHandler>>,
  req: NextApiRequest,
  res: NextApiResponse
): RequestHandler {
  const handlerSchema: Partial<Record<HttpMethod, RequestHandler>> =
    typeof handler === 'function' ? { [HttpMethod.GET]: handler } : handler
  const methodHandler = handlerSchema[req.method as HttpMethod]

  if (typeof methodHandler === 'undefined') {
    res.setHeader('Allow', Object.keys(handlerSchema))
    throw new ServerException(`Method ${req.method} Not Allow`, 405)
  }

  return methodHandler
}
