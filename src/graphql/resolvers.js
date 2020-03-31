import { User } from './sequelize'

import bcrypt from 'bcryptjs'

import jwt from 'jsonwebtoken'

import { getUserFromToken } from '../modules/jwt'

import { sendEmail } from '../modules/email'

const JWT_SECRET = process.env.JWT_SECRET

export const login = async (parent, { email, password }) => {
  try {
    const user = await User.findOne({ where: { email: email } })
    if (user) {
      const passwordChecks = await bcrypt.compare(password, user.password)
      if (passwordChecks) {
        return jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '30d' })
      }
    }
    return Promise.resolve('')
  } catch (error) {
    return Promise.resolve('')
  }
}

export const requestPasswordRecoveryUrlOverEmail = async (parent, { email }) => {
  try {
    const user = await User.findOne({ where: { email: email } })
    if (user) {
      const token = await jwt.sign({ email: email, date: Date.now() }, JWT_SECRET, { expiresIn: '10m' })
      await sendEmail(email, token)
      return Promise.resolve(true)
    }
    return Promise.resolve(false)
  } catch (error) {
    return Promise.resolve(false)
  }
}

export const addUser = async (parent, { user }) => {
  try {
    const dbUser = await User.findOne({ where: { email: user.email } })
    if (!dbUser) {
      return User.create({
        names: user.names,
        surnames: user.surnames,
        email: user.email,
        password: await bcrypt.hash(user.password, 10),
        isEmailContactAllowed: user.isEmailContactAllowed
      })
    }
  } catch (error) {
    return Promise.resolve(false)
  }
}

export const changePasswordWithToken = async (parent, { password, token }) => {
  try {
    if (await jwt.verify(token, JWT_SECRET)) {
      await User.update({ password: await bcrypt.hash(password, 10) }, { where: { email: await getUserFromToken(token) } })
      return Promise.resolve(true)
    } else {
      return Promise.resolve(false)
    }
  } catch (error) {
    return Promise.resolve(false)
  }
}

export default {
  Query: { login: login, requestPasswordRecoveryUrlOverEmail: requestPasswordRecoveryUrlOverEmail },
  Mutation: { addUser: addUser, changePasswordWithToken: changePasswordWithToken }
}
