import Sequelize from 'sequelize'

const dbDialect = process.env.DB_DIALECT || 'sqlite'
const dbPath = process.env.DB_PATH || 'deliya.sqlite'

const sequelize = new Sequelize({ dialect: dbDialect, storage: dbPath, pool: { max: 5, min: 0, idle: 10000 } })

export const User = sequelize.define('user', {
  names: { type: Sequelize.STRING },
  surnames: { type: Sequelize.STRING },
  email: { type: Sequelize.STRING },
  password: { type: Sequelize.STRING },
  isEmailContactAllowed: { type: Sequelize.BOOLEAN }
})

const initSequelize = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
    await User.sync({ force: true })
    User.create({
      names: 'Álvaro',
      surnames: 'Basallo Martínez',
      email: 'alvaro@basallo.es',
      password: '$2a$10$szbU0ZiERI8wFrbOaaTUnOqzkzKJAA4EJl6qRfGRZ8Moi07zipxTm',
      isEmailContactAllowed: true
    })
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}
initSequelize()
