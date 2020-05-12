import Sequelize from 'sequelize'

const User = sequelize =>
  sequelize.define('user', {
    names: { type: Sequelize.STRING },
    surnames: { type: Sequelize.STRING },
    email: { type: Sequelize.STRING },
    password: { type: Sequelize.STRING },
    isContactAllowed: { type: Sequelize.BOOLEAN },
    isActivated: { type: Sequelize.BOOLEAN },
    isCook: { type: Sequelize.BOOLEAN }
  })

export const initializeModel = sequelize => ({ User: User(sequelize) })
