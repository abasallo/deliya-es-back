import jwt from 'jsonwebtoken'

import bcrypt from 'bcryptjs'

import constants from './constants'

export const getUserFromToken = async token => {
  try {
    return (await jwt.verify(token, process.env.JWT_SECRET)).email
  } catch (error) {
    return undefined
  }
}

export const getTokenFromRequest = request => {
  try {
    return request.headers.authorization.split(' ')[1]
  } catch (error) {
    return undefined
  }
}

export const getAuthenticatedUserFromRequest = request => getUserFromToken(getTokenFromRequest(request))

export const generateTokenFromEmailAndTTL = (email, ttl) =>
  jwt.sign({ email: email, date: Date.now() }, process.env.JWT_SECRET, { expiresIn: ttl || constants.TOKEN_SHORT_TTL })

export const isTokenValid = token => jwt.verify(token, process.env.JWT_SECRET)

export const isPasswordValid = (plainPassword, hashedPassword) => bcrypt.compare(plainPassword, hashedPassword)

export const hashPassword = password => bcrypt.hash(password, constants.PASSWORD_HASH_SALT_ROUNDS)
