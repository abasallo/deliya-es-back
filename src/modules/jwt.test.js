import 'dotenv/config'

import jwt from 'jsonwebtoken'

import { getUserFromToken, getTokenFromRequest, getAuthenticatedUserFromRequest, generateTokenFromEmailAndTTL, isTokenValid } from './jwt'

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

test('Generates token with default TTL properly', async () => expect(await generateTokenFromEmailAndTTL('user@host.tld')).toBeDefined())

test('Checks token validity', async () => expect(await isTokenValid(await generateTokenFromEmailAndTTL('user@host.tld'))).toBeTruthy())
