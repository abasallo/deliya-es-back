import Sequelize from 'sequelize'

export const sequelize =
  process.env.NODE_ENV === 'production'
    ? new Sequelize(process.env.DATABASE_URL)
    : new Sequelize({ dialect: process.env.DATABASE_DIALECT, storage: process.env.DATABASE_PATH, pool: { max: 5, min: 0, idle: 10000 } })

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

const initNonProductionFakeData = async env => (env !== 'production' ? User.create(NonProductionFakeUser) : undefined)

export const initSequelize = async () => {
  try {
    await sequelize.authenticate()
    await User.sync({ force: true })
    await initNonProductionFakeData(process.env.NODE_ENV)
    console.log('Connection has been established successfully.')
    return true
  } catch (error) {
    console.error('Unable to connect to database:', error)
    return false
  }
}
