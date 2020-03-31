import 'dotenv/config'

import { getUserFromToken, getTokenFromRequest, getAuthenticatedUserFromRequest } from './jwt'

jest.mock('jsonwebtoken', () => ({ verify: (token, secret) => ({ email: token, secret: secret }) }))

test('Extracts user email from token', () => {
  expect(getUserFromToken('token', 'secret')).toBe('token')
  expect(getUserFromToken('', 'secret')).toBe('')
  expect(getUserFromToken(undefined, undefined)).toBe('')
})

test('Extracts token from request', () => {
  expect(getTokenFromRequest({ headers: { authorization: 'Bearer token' } })).toBe('token')
  expect(getTokenFromRequest({ headers: {} })).toBe('')
  expect(getTokenFromRequest({})).toBe('')
  expect(getTokenFromRequest('')).toBe('')
  expect(getTokenFromRequest(undefined)).toBe('')
})

test('Extracts authenticated user from request', () =>
  expect(getAuthenticatedUserFromRequest({ headers: { authorization: 'Bearer token' } })).toBe('token'))
