import jwt from 'jsonwebtoken'

import bcrypt from 'bcryptjs'

export const getUserFromToken = async token => {
  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET)
    return decoded.email
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
  jwt.sign({ email: email, date: Date.now() }, process.env.JWT_SECRET, { expiresIn: ttl || '10m' })

export const isTokenValid = token => jwt.verify(token, process.env.JWT_SECRET)

export const isPasswordValid = (plainPassword, hashedPassword) => bcrypt.compare(plainPassword, hashedPassword)

export const hashPassword = password => bcrypt.hash(password, 10)
