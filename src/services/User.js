import { getUserFromToken, generateTokenFromEmailAndTTL, isTokenValid, isPasswordValid, hashPassword } from '../modules/crypto'
import { sendPasswordRecoveryEmail, sendActivationRecoveryEmail } from '../modules/email'

import { AuthenticationError, PersistedQueryNotFoundError, ValidationError } from 'apollo-server-errors'

import constants from '../modules/constants'

export const doesUserExists = async (email, model) => {
  const user = await (await model).User.findOne({ where: { email: email } })
  return !!(user && Object.entries(user).length !== 0)
}

export const login = async (email, password, model) => {
  const user = await (await model).User.findOne({ where: { email: email } })
  if (user && user.dataValues.isActivated) {
    if (await isPasswordValid(password, user.password)) return generateTokenFromEmailAndTTL(user.email, constants.TOKEN_LONG_TTL)
    throw new AuthenticationError(constants.USER_ERROR_PASSWORD)
  }
  throw new PersistedQueryNotFoundError(constants.USER_ERROR_NOT_FOUND)
}

export const requestPasswordRecoveryUrlOverEmail = async (email, model) => {
  const user = await (await model).User.findOne({ where: { email: email } })
  if (user) {
    sendPasswordRecoveryEmail(await generateTokenFromEmailAndTTL(email), email)
    return true
  }
  throw new PersistedQueryNotFoundError(constants.USER_ERROR_NOT_FOUND)
}

export const requestUserActivationUrlOverEmail = async (email, model) => {
  const user = await (await model).User.findOne({ where: { email: email } })
  if (user) {
    sendActivationRecoveryEmail(await generateTokenFromEmailAndTTL(email), email)
    return true
  }
  throw new PersistedQueryNotFoundError(constants.USER_ERROR_NOT_FOUND)
}

export const addUser = async (user, model) => {
  if (!(await (await model).User.findOne({ where: { email: user.email } }))) {
    return (await model).User.create({
      names: user.names,
      surnames: user.surnames,
      email: user.email,
      password: await hashPassword(user.password, constants.PASSWORD_HASH_SALT_ROUNDS),
      isEmailContactAllowed: user.isEmailContactAllowed,
      isActivated: false
    })
  }
  throw new ValidationError(constants.USER_ERROR_MESSAGE_ALREADY_USED)
}

export const activateUser = async (token, model) => {
  if (await isTokenValid(token)) {
    await (await model).User.update({ isActivated: true }, { where: { email: await getUserFromToken(token) } })
    return true
  } else {
    throw new AuthenticationError(constants.USER_ERROR_MESSAGE_INVALID_TOKEN)
  }
}

export const changePassword = async (password, token, model) => {
  if (await isTokenValid(token)) {
    await (await model).User.update({ password: await hashPassword(password, constants.PASSWORD_HASH_SALT_ROUNDS) }, { where: { email: await getUserFromToken(token) } })
    return true
  } else {
    throw new AuthenticationError(constants.USER_ERROR_MESSAGE_INVALID_TOKEN)
  }
}
