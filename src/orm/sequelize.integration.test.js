import 'dotenv/config'

import { TestUser } from './bootstrap'

// TODO - Extract to common test utilities
const initalizeDatabase = async environment => {
  process.env.NODE_ENV = environment
  process.env.DATABASE_URL = 'sqlite://deliya-production.test.sqlite'
  jest.resetModules()
  const sequelize = require('./sequelize')
  const model = await sequelize.initSequelize()
  return { sequelize, model }
}

test('Production database must be properly initialized', async () => {
  const { sequelize, model } = await initalizeDatabase('production')

  const userCount = await model.User.findAndCountAll()

  expect(userCount.count).toEqual(0)

  await sequelize.closeSequelize()
})

test('Test database must be properly initialized', async () => {
  const { sequelize, model } = await initalizeDatabase('test')

  const user = await model.User.findOne({ where: { email: 'user@host.tld' } })

  expect(user.names).toBe(TestUser.names)
  expect(user.surnames).toBe(TestUser.surnames)
  expect(user.email).toBe(TestUser.email)
  expect(user.password).toBe(TestUser.password)

  await sequelize.closeSequelize()
})

test('Dev database must be properly initialized', async () => {
  const { sequelize, model } = await initalizeDatabase('dev')

  const user = await model.User.findOne({ where: { email: 'user@host.tld' } })

  expect(user.names).toBe(TestUser.names)
  expect(user.surnames).toBe(TestUser.surnames)
  expect(user.email).toBe(TestUser.email)
  expect(user.password).toBe(TestUser.password)

  await sequelize.closeSequelize()
})
