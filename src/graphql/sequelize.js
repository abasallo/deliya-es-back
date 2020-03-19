import Sequelize from 'sequelize'

let sequelize
if (process.env.NODE_ENV === 'production') {
  sequelize = new Sequelize(process.env.DATABASE_URL)
} else {
  sequelize = new Sequelize({
    dialect: process.env.DATABASE_DIALECT,
    storage: process.env.DATABASE_PATH,
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    }
  })
}

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
    if (process.env.NODE_ENV !== 'production') {
      User.create({
        names: 'Álvaro',
        surnames: 'Basallo Martínez',
        email: 'alvaro@basallo.es',
        password: '$2a$10$szbU0ZiERI8wFrbOaaTUnOqzkzKJAA4EJl6qRfGRZ8Moi07zipxTm',
        isEmailContactAllowed: true
      })
    }
  } catch (error) {
    console.error('Unable to connect to database:', error)
  }
}

initSequelize().catch(error => console.error('Unable to initialize database:', error))
