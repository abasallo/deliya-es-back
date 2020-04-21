import 'dotenv/config'

import { initializeTestDatabase } from '../modules/testDatabase'

import { TestUser } from './bootstrap'

import constants from '../modules/constants'

test('Production database must be properly initialized', async () => {
  const { sequelize, model } = initializeTestDatabase(constants.NODE_PRODUCTION_STRING)

  const userCount = await (await model).User.findAndCountAll()

  expect(userCount.count).toEqual(0)

  await sequelize.closeSequelize()
})

test('Test database must be properly initialized', async () => {
  const { sequelize, model } = await initializeTestDatabase(constants.NODE_TEST_STRING)

  const user = await (await model).User.findOne({ where: { email: 'user@host.tld' } })

  expect(user.names).toBe(TestUser.names)
  expect(user.surnames).toBe(TestUser.surnames)
  expect(user.email).toBe(TestUser.email)
  expect(user.password).toBe(TestUser.password)

  await sequelize.closeSequelize()
})

test('Dev database must be properly initialized', async () => {
  const { sequelize, model } = await initializeTestDatabase(constants.NODE_DEVELOPMENT_STRING)

  const user = await (await model).User.findOne({ where: { email: 'user@host.tld' } })

  expect(user.names).toBe(TestUser.names)
  expect(user.surnames).toBe(TestUser.surnames)
  expect(user.email).toBe(TestUser.email)
  expect(user.password).toBe(TestUser.password)

  await sequelize.closeSequelize()
})
