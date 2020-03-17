import { AuthenticationError } from 'apollo-server'

import { User } from './sequelize'

import bcrypt from 'bcryptjs'

import jwt from 'jsonwebtoken'

import { sendEmail } from '../modules/email'

export default {
  Query: {
    login: async (parent, { email, password }) => {
      try {
        const user = await User.findOne({ where: { email: email } })
        return (await bcrypt.compare(password, user.password))
          ? jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '30d' })
          : ''
      } catch (error) {
        return ''
      }
    },
    requestPasswordRecoveryUrlOverEmail: async (parent, { email }) => {
      try {
        return (await User.findOne({ where: { email: email } }))
          ? sendEmail(email, await jwt.sign({ email: email, date: Date.now() }, process.env.JWT_SECRET, { expiresIn: '10m' }))
          : false
      } catch (error) {
        return false
      }
    }
  },
  Mutation: {
    addUser: async (parent, { user }) => {
      const alreadyExistentUser = await User.findOne({ where: { email: user.email } })
      if (alreadyExistentUser) throw new AuthenticationError() // TODO - Add specific, duplicated email error (unique field)
      try {
        return User.create({
          names: user.names,
          surnames: user.surnames,
          email: user.email,
          password: await bcrypt.hash(user.password, 10),
          isEmailContactAllowed: user.isEmailContactAllowed
        })
      } catch (error) {
        return undefined
      }
    },
    changePasswordWithToken: async (parent, { password, token }) => {
      try {
        User.update({ password: await bcrypt.hash(password, 10) }, { where: { email: jwt.verify(token, process.env.JWT_SECRET).email } })
        return true
      } catch (error) {
        return false
      }
    }
  }
}
