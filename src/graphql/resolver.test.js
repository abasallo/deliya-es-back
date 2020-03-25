import jwt from 'jsonwebtoken'

import '../modules/dotenv'

import { login, requestPasswordRecoveryUrlOverEmail, addUser, changePasswordWithToken } from './resolvers'

import { initSequelize } from './sequelize'

jest.mock('../modules/email', () => ({ sendEmail: () => true }))

beforeAll(() => initSequelize())

test('Logs user with email and password', async () => {
  expect(login({}, { email: 'alvaro@basallo.es', password: 'ojete' })).toBeTruthy()
  expect(login({}, { email: 'alvaro@basallo.es', password: 'cancamusa' })).resolves.toBe({})
})

test('Request password recovery', async () => {
  expect(requestPasswordRecoveryUrlOverEmail({}, { email: 'alvaro@basallo.es' })).toBeTruthy()
  expect(requestPasswordRecoveryUrlOverEmail({}, { email: 'inexistent@email.es' })).resolves.toBe({})
})

test('Adds user, if not already exists', async () => {
  expect(
    addUser(
      {},
      {
        names: 'names',
        surnames: 'surnames',
        email: 'email',
        password: 'password',
        isEmailContactAllowed: true
      }
    )
  ).toBeTruthy()
  expect(
    addUser(
      {},
      {
        names: 'names',
        surnames: 'surnames',
        email: 'alvaro@basallo.es',
        password: 'password',
        isEmailContactAllowed: true
      }
    )
  ).resolves.toBe({})
})

test('Change password with token', async () => {
  expect(
    changePasswordWithToken(
      {},
      {
        password: 'changedPassword',
        token: jwt.sign({ email: 'alvaro@basallo.es', date: Date.now() }, process.env.JWT_SECRET, { expiresIn: '10m' })
      }
    )
  ).toBeTruthy()
  expect(login({}, { email: 'alvaro@basallo.es', password: 'changedPassword' }))
})
