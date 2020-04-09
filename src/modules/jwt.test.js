import 'dotenv/config'

import jwt from 'jsonwebtoken'

import { getUserFromToken, getTokenFromRequest, getAuthenticatedUserFromRequest } from './jwt'

const properToken = jwt.sign({ email: 'email', date: Date.now() }, process.env.JWT_SECRET, { expiresIn: '10m' })

test('Extracts user email from token', async () => {
  expect(getUserFromToken(await properToken)).resolves.toEqual('email')
  expect(getUserFromToken('wrongToken')).resolves.toBe(undefined)
  expect(getUserFromToken('')).resolves.toBe(undefined)
  expect(getUserFromToken(undefined)).resolves.toBe(undefined)
})

test('Extracts token from request', () => {
  expect(getTokenFromRequest({ headers: { authorization: 'Bearer token' } })).toBe('token')
  expect(getTokenFromRequest({ headers: {} })).toBe(undefined)
  expect(getTokenFromRequest({})).toBe(undefined)
  expect(getTokenFromRequest(undefined)).toBe(undefined)
  expect(getTokenFromRequest(undefined)).toBe(undefined)
})

test('Extracts authenticated user from request', async () => {
  expect(getAuthenticatedUserFromRequest({ headers: { authorization: 'Bearer ' + (await properToken) } })).resolves.toBe('email')
})
