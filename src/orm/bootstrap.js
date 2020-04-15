const NODE_ENV_PRODUCTION_STRING = 'production'

export const TestUser = {
  names: 'name',
  surnames: 'surnames',
  email: 'user@host.tld',
  password: '$2y$12$NeJhI/.IIUpkKzBAatDLKe8gEMPL..kSsEujozUE.jJ4n0f4YR6i2', // password: password
  isEmailContactAllowed: true,
  isActivated: true
}

export const TestUserDeactivated = {
  names: 'name',
  surnames: 'surnames',
  email: 'userDeactivated@host.tld',
  password: '$2y$12$NeJhI/.IIUpkKzBAatDLKe8gEMPL..kSsEujozUE.jJ4n0f4YR6i2', // password: password
  isEmailContactAllowed: true,
  isActivated: false
}

export const initializeData = (model, env) => {
  if (env !== NODE_ENV_PRODUCTION_STRING) {
    model.User.create(TestUser)
    model.User.create(TestUserDeactivated)
  }
}
