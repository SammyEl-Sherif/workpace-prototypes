export class ClientSideError extends Error {
  readonly canReset: boolean = true
  readonly isCritical: boolean = true
}
