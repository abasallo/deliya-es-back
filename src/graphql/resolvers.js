import {
  doesUserExists,
  login,
  requestPasswordRecoveryUrlOverEmail,
  requestUserActivationUrlOverEmail,
  addUser,
  activateUser,
  changePassword
} from '../services/User'

export default {
  Query: {
    doesUserExists: (parent, { email }, { model }) => doesUserExists(email, model),
    login: (parent, { email, password }, { model }) => login(email, password, model),
    requestPasswordRecoveryUrlOverEmail: (parent, { email }, { model }) => requestPasswordRecoveryUrlOverEmail(email, model),
    requestUserActivationUrlOverEmail: (parent, { email }, { model }) => requestUserActivationUrlOverEmail(email, model)
  },
  Mutation: {
    addUser: (parent, { user }, { model }) => addUser(user, model),
    activateUser: (parent, { token }, { model }) => activateUser(token, model),
    changePasswordWithToken: (parent, { password, token }, { model }) => changePassword(password, token, model)
  }
}
