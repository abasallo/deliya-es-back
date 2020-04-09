import bcrypt from 'bcryptjs' // TODO - Move to utilities in modules/?.js, maybe merge with jwt.js
import jwt from 'jsonwebtoken' // TODO - Move to utilities in modules/jwt.js

import { getUserFromToken } from '../modules/jwt'
import { sendEmail } from '../modules/email'

import { AuthenticationError, PersistedQueryNotFoundError, ValidationError } from 'apollo-server-errors'

export const login = async (email, password, model) => {
  const user = await (await model).User.findOne({ where: { email: email } })
  if (user) {
    if (await bcrypt.compare(password, user.password)) {
      return jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '30d' })
    }
    throw new AuthenticationError('Invalid password')
  }
  throw new PersistedQueryNotFoundError('User not found')
}

export const passwordRecoveryUrl = async (email, model) => {
  const user = await (await model).User.findOne({ where: { email: email } })

  if (user) {
    await sendEmail(email, await jwt.sign({ email: email, date: Date.now() }, process.env.JWT_SECRET, { expiresIn: '10m' }))
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
      isEmailContactAllowed: user.isEmailContactAllowed
    })
  }
  throw new ValidationError('Already existing User')
}

export const changePassword = async (password, token, model) => {
  try {
    await jwt.verify(token, process.env.JWT_SECRET)
    await (await model).User.update({ password: await bcrypt.hash(password, 10) }, { where: { email: await getUserFromToken(token) } })
    return true
  } catch (error) {
    throw new AuthenticationError('Invalid token')
  }
}
