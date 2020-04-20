import 'dotenv/config'

import jwt from 'jsonwebtoken' // TODO - Move to utilities in modules/jwt.js

import { initializeTestDatabase } from '../modules/testDatabase'

import { AuthenticationError, PersistedQueryNotFoundError, ValidationError } from 'apollo-server-errors'

import { TestUser, TestUserDeactivated } from '../orm/bootstrap'

import {
  activateUser,
  addUser,
  changePassword,
  doesUserExists,
  login,
  requestPasswordRecoveryUrlOverEmail,
  requestUserActivationUrlOverEmail
} from './User'

let sequelize
let model

beforeEach(async () => ({ sequelize, model } = await initializeTestDatabase('test')))

afterEach(async () => await sequelize.closeSequelize())

test('Checks existing user existence', () => expect(doesUserExists(TestUser.email, model)).resolves.toEqual(true))

test('Checks non existing user existence', () => expect(doesUserExists('inexistentUser@host.tld', model)).resolves.toEqual(false))

test('Logs user with correct email and password', async () => {
  const loginOK = await login(TestUser.email, 'password', model)
  expect(await jwt.verify(loginOK, process.env.JWT_SECRET)).toBeTruthy()
})

test('Logs user with correct email and password, but deactivated', async () => {
  const loginOKDeactivated = login(TestUserDeactivated.email, 'password', model)
  await expect(loginOKDeactivated).rejects.toThrow(new PersistedQueryNotFoundError('User not found'))
})

test('Logs user with correct email and wrong password', async () => {
  const loginKOPassword = login(TestUser.email, 'wrongPassword', model)
  await expect(loginKOPassword).rejects.toThrow(new AuthenticationError('Invalid password'))
})

test('Logs user with non existent email', async () => {
  const loginKOEmail = login('inexistentUser@host.tld', 'password', model)
  await expect(loginKOEmail).rejects.toThrow(new PersistedQueryNotFoundError('User not found'))
})

test('Request password recovery', async () => {
  // TODO - Mock sendEmail to avoid email to actually be sent to a fake email
  const passwordRecoveryRequestOK = await requestPasswordRecoveryUrlOverEmail(TestUser.email, model)
  expect(passwordRecoveryRequestOK).toBeTruthy()
})

test('Request password recovery with non existing email', async () => {
  // TODO - Mock sendEmail to avoid email to actually be sent to a fake email
  const passwordRecoveryRequestKO = requestPasswordRecoveryUrlOverEmail('inexistentUser@host.tld', model)
  await expect(passwordRecoveryRequestKO).rejects.toThrow(new PersistedQueryNotFoundError('User not found'))
})

test('Request user activation', async () => {
  // TODO - Mock sendEmail to avoid email to actually be sent to a fake email
  const passwordRecoveryRequestOK = await requestUserActivationUrlOverEmail(TestUser.email, model)
  expect(passwordRecoveryRequestOK).toBeTruthy()
})

test('Request user activation with non existing email', async () => {
  // TODO - Mock sendEmail to avoid email to actually be sent to a fake email
  const passwordRecoveryRequestKO = requestUserActivationUrlOverEmail('inexistentUser@host.tld', model)
  await expect(passwordRecoveryRequestKO).rejects.toThrow(new PersistedQueryNotFoundError('User not found'))
})

test('Adds user, if not already exists', async () => {
  await expect(addUser(TestUser, model)).rejects.toThrow(new ValidationError('Already existing User'))
})

test('Activates User with token', async () => {
  const token = await jwt.sign({ email: TestUserDeactivated.email, date: Date.now() }, process.env.JWT_SECRET, { expiresIn: '10m' })
  const userActivationResponse = await activateUser(token, model)
  expect(userActivationResponse).toBeTruthy()

  const loginResponse = await login(TestUserDeactivated.email, 'password', model)
  expect(await jwt.verify(loginResponse, process.env.JWT_SECRET)).toBeTruthy()
})

test('Change password with token', async () => {
  const token = await jwt.sign({ email: TestUser.email, date: Date.now() }, process.env.JWT_SECRET, { expiresIn: '10m' })
  const passwordChangedResponse = await changePassword('changedPassword', token, model)
  expect(passwordChangedResponse).toBeTruthy()

  const loginResponse = await login(TestUser.email, 'changedPassword', model)
  expect(await jwt.verify(loginResponse, process.env.JWT_SECRET)).toBeTruthy()
})
