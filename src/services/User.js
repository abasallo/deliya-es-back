import bcrypt from 'bcryptjs' // TODO - Move to utilities in modules/?.js, maybe merge with jwt.js

import { getUserFromToken, generateTokenFromEmailAndTTL, isTokenValid } from '../modules/jwt'
import { sendPasswordRecoveryEmail, sendActivationRecoveryEmail } from '../modules/email'

import { AuthenticationError, PersistedQueryNotFoundError, ValidationError } from 'apollo-server-errors'

export const doesUserExists = async (email, model) => {
  const user = await (await model).User.findOne({ where: { email: email } })
  return !!(user && Object.entries(user).length !== 0)
}

export const login = async (email, password, model) => {
  const user = await (await model).User.findOne({ where: { email: email } })
  if (user && user.dataValues.isActivated) {
    if (await bcrypt.compare(password, user.password)) return generateTokenFromEmailAndTTL(user.email, '30d')
    throw new AuthenticationError('Invalid password')
  }
  throw new PersistedQueryNotFoundError('User not found')
}

export const requestPasswordRecoveryUrlOverEmail = async (email, model) => {
  const user = await (await model).User.findOne({ where: { email: email } })
  if (user) {
    sendPasswordRecoveryEmail(await generateTokenFromEmailAndTTL(email), email)
    return true
  }
  throw new PersistedQueryNotFoundError('User not found')
}

export const requestUserActivationUrlOverEmail = async (email, model) => {
  const user = await (await model).User.findOne({ where: { email: email } })
  if (user) {
    sendActivationRecoveryEmail(await generateTokenFromEmailAndTTL(email), email)
    return true
  }
  throw new PersistedQueryNotFoundError('User not found')
}

export const addUser = async (user, model) => {
  if (!(await (await model).User.findOne({ where: { email: user.email } }))) {
    return (await model).User.create({
      names: user.names,
      surnames: user.surnames,
      email: user.email,
      password: await bcrypt.hash(user.password, 10),
      isEmailContactAllowed: user.isEmailContactAllowed,
      isActivated: false
    })
  }
  throw new ValidationError('Already existing User')
}

export const activateUser = async (token, model) => {
  if (await isTokenValid(token)) {
    await (await model).User.update({ isActivated: true }, { where: { email: await getUserFromToken(token) } })
    return true
  } else {
    throw new AuthenticationError('Invalid token')
  }
}

export const changePassword = async (password, token, model) => {
  if (await isTokenValid(token)) {
    await (await model).User.update({ password: await bcrypt.hash(password, 10) }, { where: { email: await getUserFromToken(token) } })
    return true
  } else {
    throw new AuthenticationError('Invalid token')
  }
}
