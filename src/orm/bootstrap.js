import constants from '../modules/constants'

export const TestUser = {
  names: 'name',
  surnames: 'surnames',
  email: 'user@host.tld',
  password: '$2y$12$NeJhI/.IIUpkKzBAatDLKe8gEMPL..kSsEujozUE.jJ4n0f4YR6i2', // password: password
  isContactAllowed: true,
  isCook: false,
  isActivated: true
}

export const TestUserDeactivated = {
  names: 'name',
  surnames: 'surnames',
  email: 'userDeactivated@host.tld',
  password: '$2y$12$NeJhI/.IIUpkKzBAatDLKe8gEMPL..kSsEujozUE.jJ4n0f4YR6i2', // password: password
  isContactAllowed: true,
  isCook: false,
  isActivated: false
}

export const initializeData = (model, env) => {
  if (env !== constants.NODE_PRODUCTION_STRING) {
    model.User.create(TestUser)
    model.User.create(TestUserDeactivated)
  }
}
