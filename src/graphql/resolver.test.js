import 'dotenv/config'

import jwt from 'jsonwebtoken'

import { login, requestPasswordRecoveryUrlOverEmail, addUser, changePasswordWithToken } from './resolvers'

import { initSequelize } from './sequelize'

const JWT_SECRET = process.env.JWT_SECRET

jest.mock('../modules/email', () => ({ sendEmail: () => true }))

beforeAll(() => initSequelize())

test('Logs user with email and password', async () => {
  const loginOK = await login({}, { email: 'alvaro@basallo.es', password: 'ojete' })
  expect(loginOK).toBeTruthy()
  const loginKO = await login({}, { email: 'alvaro@basallo.es', password: 'cancamusa' })
  expect(loginKO).toBe('')
})

test('Request password recovery', async () => {
  const passwordRecoveryRequestOK = await requestPasswordRecoveryUrlOverEmail({}, { email: 'alvaro@basallo.es' })
  expect(passwordRecoveryRequestOK).toBeTruthy()
  const passwordRecoveryRequestKO = await requestPasswordRecoveryUrlOverEmail({}, { email: 'inexistent@email.es' })
  expect(passwordRecoveryRequestKO).toBeFalsy()
})

test('Adds user, if not already exists', async () => {
  const firstAddUserAttempt = await addUser(
    {},
    {
      user: {
        names: 'names',
        surnames: 'surnames',
        email: 'email',
        password: 'password',
        isEmailContactAllowed: true
      }
    }
  )
  expect(firstAddUserAttempt).toBeTruthy()
  const secondAddUserAttempt = await addUser(
    {},
    {
      user: {
        names: 'names',
        surnames: 'surnames',
        email: 'email',
        password: 'password',
        isEmailContactAllowed: true
      }
    }
  )
  expect(secondAddUserAttempt).toBe(undefined)
})

test('Change password with token', async () => {
  const token = await jwt.sign({ email: 'alvaro@basallo.es', date: Date.now() }, JWT_SECRET, { expiresIn: '10m' })
  const passwordChanged = await changePasswordWithToken({}, { password: 'changedPassword', token: token })
  expect(passwordChanged).toBeTruthy()
  const result = await login({}, { email: 'alvaro@basallo.es', password: 'changedPassword' })
  expect(result).toBeTruthy()
})
