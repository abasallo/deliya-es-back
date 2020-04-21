import { initializeTestDatabase } from './testDatabase'

import constants from './constants'

test('Test database should be properly initialized', async () => {
  const { sequelize, model } = initializeTestDatabase(constants.NODE_TEST_STRING)
  expect(sequelize).toBeDefined()
  expect((await model).User.tableName).toEqual(constants.USER_DATABASE_TABLE_NAME)
})
