import 'dotenv/config'

import { initializeTestDatabase } from '../modules/testDatabase'

import { TestUser } from './bootstrap'

test('Production database must be properly initialized', async () => {
  const { sequelize, model } = initializeTestDatabase('production')

  const userCount = await (await model).User.findAndCountAll()

  expect(userCount.count).toEqual(0)

  await sequelize.closeSequelize()
})

test('Test database must be properly initialized', async () => {
  const { sequelize, model } = await initializeTestDatabase('test')

  const user = await (await model).User.findOne({ where: { email: 'user@host.tld' } })

  expect(user.names).toBe(TestUser.names)
  expect(user.surnames).toBe(TestUser.surnames)
  expect(user.email).toBe(TestUser.email)
  expect(user.password).toBe(TestUser.password)

  await sequelize.closeSequelize()
})

test('Dev database must be properly initialized', async () => {
  const { sequelize, model } = await initializeTestDatabase('dev')

  const user = await (await model).User.findOne({ where: { email: 'user@host.tld' } })

  expect(user.names).toBe(TestUser.names)
  expect(user.surnames).toBe(TestUser.surnames)
  expect(user.email).toBe(TestUser.email)
  expect(user.password).toBe(TestUser.password)

  await sequelize.closeSequelize()
})
