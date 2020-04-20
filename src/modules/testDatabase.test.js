import { initializeTestDatabase } from './testDatabase'

test('Test database should be properly initialized', async () => {
  const { sequelize, model } = initializeTestDatabase('test')
  expect(sequelize).toBeDefined()
  expect((await model).User.tableName).toEqual('users')
})
