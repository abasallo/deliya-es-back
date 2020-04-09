import { login, passwordRecoveryUrl, addUser, changePassword } from '../services/User'

export default {
  Query: {
    login: (parent, { email, password }, { model }) => login(email, password, model),
    requestPasswordRecoveryUrlOverEmail: (parent, { email }, { model }) => passwordRecoveryUrl(email, model)
  },
  Mutation: {
    addUser: (parent, { user }, { model }) => addUser(user, model),
    changePasswordWithToken: (parent, { password, token }, { model }) => changePassword(password, token, model)
  }
}
