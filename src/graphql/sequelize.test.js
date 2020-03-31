import 'dotenv/config'

import { sequelize, User, NonProductionFakeUser, initSequelize } from './sequelize'

test('Sequelize object must be initalized', async () => expect(sequelize).toBeTruthy())

test('User object must be initalized', async () => expect(User).toBeTruthy())

test('Development database must be properly initialized', async () => {
  await initSequelize()
  const user = await User.findOne({ where: { email: 'alvaro@basallo.es' } })
  expect(user.names).toBe(NonProductionFakeUser.names)
  expect(user.surnames).toBe(NonProductionFakeUser.surnames)
  expect(user.email).toBe(NonProductionFakeUser.email)
  expect(user.password).toBe(NonProductionFakeUser.password)
})
