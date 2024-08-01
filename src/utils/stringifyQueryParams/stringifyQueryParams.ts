import qs, { StringifyOptions } from 'query-string'

export const stringifyQueryParams = (
  params: Record<string, unknown>,
  options?: StringifyOptions
): string =>
  qs.stringify(params, { arrayFormat: 'comma', skipEmptyString: true, skipNull: true, ...options })
