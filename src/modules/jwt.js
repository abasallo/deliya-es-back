import jwt from 'jsonwebtoken'

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
