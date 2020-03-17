import jwt from 'jsonwebtoken'

const getUserFromToken = token => (token ? jwt.verify(token, process.env.JWT_SECRET).email : '')

const getTokenFromRequest = request => (request.headers.authorization || '').split(' ')[1]

export const getAuthenticatedUserFromRequest = request => getUserFromToken(getTokenFromRequest(request))
