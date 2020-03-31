import 'dotenv/config'

import { sequelize, User, NonProductionFakeUser, initSequelize } from './sequelize'

test('Sequelize object must be initalized', () => expect(sequelize).toBeTruthy())

test('User object must be initialized', () => expect(User).toBeTruthy())

test('Development database must be properly initialized', async () => {
  expect(await initSequelize()).toBeTruthy()
  const user = await User.findOne({ where: { email: 'alvaro@basallo.es' } })
  expect(user.names).toBe(NonProductionFakeUser.names)
  expect(user.surnames).toBe(NonProductionFakeUser.surnames)
  expect(user.email).toBe(NonProductionFakeUser.email)
  expect(user.password).toBe(NonProductionFakeUser.password)
})
