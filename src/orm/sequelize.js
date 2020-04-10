import 'dotenv/config'

import constants from '../modules/constants'

import Sequelize from 'sequelize'

import { initializeModel } from './model'
import { initializeData } from './bootstrap'

const connectWithUrl = url => new Sequelize(url)

const connectWithOptions = (dbDialect, dbPath, dbPoolMax, dbPoolMin, dbPoolIdle) => {
  return new Sequelize({
    dialect: dbDialect,
    storage: dbPath,
    pool: { max: parseInt(dbPoolMax), min: parseInt(dbPoolMin), idle: parseInt(dbPoolIdle) }
  })
}

export const sequelize = (() => {
  if (process.env.NODE_ENV === constants.NODE_PRODUCTION_STRING) {
    return connectWithUrl(process.env.DATABASE_URL)
  }

  if (process.env.NODE_ENV === constants.NODE_TEST_STRING) {
    return connectWithOptions(
      process.env.DATABASE_DIALECT,
      process.env.DATABASE_PATH_TEST,
      process.env.DATABASE_POOL_MAX,
      process.env.DATABASE_POOL_MIN,
      process.env.DATABASE_POOL_IDLE
    )
  }

  return connectWithOptions(
    process.env.DATABASE_DIALECT,
    process.env.DATABASE_PATH,
    process.env.DATABASE_POOL_MAX,
    process.env.DATABASE_POOL_MIN,
    process.env.DATABASE_POOL_IDLE
  )
})()

export const initSequelize = async () => {
  const model = await initializeModel(await sequelize)
  await sequelize.sync({ force: true })
  await initializeData(model, process.env.NODE_ENV)
  return model
}

export const closeSequelize = () => sequelize.close()
