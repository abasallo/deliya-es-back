import Sequelize from 'sequelize'

const NODE_ENV = process.env.NODE_ENV
const NODE_ENV_PRODUCTION_STRING = 'production'

const DATABASE_URL = process.env.DATABASE_URL
const DATABASE_DIALECT = process.env.DATABASE_DIALECT
const DATABASE_PATH = process.env.DATABASE_PATH

export const sequelize =
  NODE_ENV === 'production'
    ? new Sequelize(DATABASE_URL)
    : new Sequelize({ dialect: DATABASE_DIALECT, storage: DATABASE_PATH, pool: { max: 5, min: 0, idle: 10000 } })

export const User = sequelize.define('user', {
  names: { type: Sequelize.STRING },
  surnames: { type: Sequelize.STRING },
  email: { type: Sequelize.STRING },
  password: { type: Sequelize.STRING },
  isEmailContactAllowed: { type: Sequelize.BOOLEAN }
})

export const NonProductionFakeUser = {
  names: 'Álvaro',
  surnames: 'Basallo Martínez',
  email: 'alvaro@basallo.es',
  password: '$2a$10$szbU0ZiERI8wFrbOaaTUnOqzkzKJAA4EJl6qRfGRZ8Moi07zipxTm',
  isEmailContactAllowed: true
}

const initNonProductionFakeData = async env => (env !== NODE_ENV_PRODUCTION_STRING ? User.create(NonProductionFakeUser) : undefined)

export const initSequelize = async () => {
  try {
    await sequelize.authenticate()
    await User.sync({ force: true })
    await initNonProductionFakeData(NODE_ENV)
    console.log('Connection has been established successfully.')
    return true
  } catch (error) {
    console.error('Unable to connect to database:', error)
    return false
  }
}
