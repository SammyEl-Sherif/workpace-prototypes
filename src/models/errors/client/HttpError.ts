import { ClientSideError } from './ClientSideError'

type HttpErrorArgs = {
  data?: unknown
  message: string
  httpStatusCode: number
}

export class HttpError extends ClientSideError implements HttpErrorArgs {
  readonly isCritical = false
  readonly httpStatusCode: number = 500
  readonly data

  constructor({ message, data, httpStatusCode }: HttpErrorArgs) {
    super(message)

    this.httpStatusCode = httpStatusCode
    this.data = data
  }
}
