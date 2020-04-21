import 'dotenv/config'

import { initializeTestDatabase } from '../modules/testDatabase'

import { isTokenValid, generateTokenFromEmailAndTTL } from '../modules/crypto'

import { AuthenticationError, PersistedQueryNotFoundError, ValidationError } from 'apollo-server-errors'

import {
  addUser,
  changePassword,
  doesUserExists,
  login,
  requestPasswordRecoveryUrlOverEmail,
  requestUserActivationUrlOverEmail,
  activateUser
} from './User'

import constants from '../modules/constants'

import { TestUser, TestUserDeactivated } from '../orm/bootstrap'

let sequelize
let model

beforeEach(async () => ({ sequelize, model } = await initializeTestDatabase(constants.NODE_DEVELOPMENT_STRING)))

afterEach(async () => await sequelize.closeSequelize())

test('Checks existing user existence', () => expect(doesUserExists(TestUser.email, model)).resolves.toBeTruthy())

test('Checks non existing user existence', () => expect(doesUserExists('inexistentUser@host.tld', model)).resolves.toBeFalsy())

test('Logs user with correct email and password', async () =>
  expect(await isTokenValid(await login(TestUser.email, 'password', model))).toBeTruthy())

test('Logs user with correct email and password, but deactivated', async () => {
  const loginOKDeactivated = login(TestUserDeactivated.email, 'password', model)
  await expect(loginOKDeactivated).rejects.toThrow(new PersistedQueryNotFoundError(constants.USER_ERROR_NOT_FOUND))
})

test('Logs user with correct email and wrong password', async () => {
  const loginKOPassword = login(TestUser.email, 'wrongPassword', model)
  await expect(loginKOPassword).rejects.toThrow(new AuthenticationError(constants.USER_ERROR_PASSWORD))
})

test('Logs user with non existent email', async () => {
  const loginKOEmail = login('inexistentUser@host.tld', 'password', model)
  await expect(loginKOEmail).rejects.toThrow(new PersistedQueryNotFoundError(constants.USER_ERROR_NOT_FOUND))
})

test('Request password recovery', async () => {
  const passwordRecoveryRequestOK = await requestPasswordRecoveryUrlOverEmail(TestUser.email, model)
  expect(passwordRecoveryRequestOK).toBeTruthy()
})

test('Request password recovery with non existing email', async () => {
  const passwordRecoveryRequestKO = requestPasswordRecoveryUrlOverEmail('inexistentUser@host.tld', model)
  await expect(passwordRecoveryRequestKO).rejects.toThrow(new PersistedQueryNotFoundError(constants.USER_ERROR_NOT_FOUND))
})

test('Request user activation', async () => {
  const passwordRecoveryRequestOK = await requestUserActivationUrlOverEmail(TestUser.email, model)
  expect(passwordRecoveryRequestOK).toBeTruthy()
})

test('Request user activation with non existing email', async () => {
  const passwordRecoveryRequestKO = requestUserActivationUrlOverEmail('inexistentUser@host.tld', model)
  await expect(passwordRecoveryRequestKO).rejects.toThrow(new PersistedQueryNotFoundError(constants.USER_ERROR_NOT_FOUND))
})

test('Adds user, if not already exists', async () => {
  await expect(addUser(TestUser, model)).rejects.toThrow(new ValidationError(constants.USER_ERROR_MESSAGE_ALREADY_USED))
})

test('Activates User with token', async () => {
  expect(await activateUser(await generateTokenFromEmailAndTTL(TestUserDeactivated.email), model)).toBeTruthy()
  expect(await isTokenValid(await login(TestUserDeactivated.email, 'password', model))).toBeTruthy()
})

test('Change password with token', async () => {
  expect(await changePassword('changedPassword', await generateTokenFromEmailAndTTL(TestUser.email), model)).toBeTruthy()
  expect(await isTokenValid(await login(TestUser.email, 'changedPassword', model))).toBeTruthy()
})
