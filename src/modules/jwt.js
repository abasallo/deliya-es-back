import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET

export const getUserFromToken = token => (token ? jwt.verify(token, JWT_SECRET).email : '')

export const getTokenFromRequest = request => {
  try {
    return request.headers.authorization || '' ? (request.headers.authorization || '').split(' ')[1] : ''
  } catch (e) {
    return ''
  }
}

export const getAuthenticatedUserFromRequest = request => getUserFromToken(getTokenFromRequest(request))
