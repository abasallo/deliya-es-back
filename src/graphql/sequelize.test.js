import '../modules/dotenv'
import { sequelize, User, NonProductionFakeUser, initSequelize } from './sequelize'

test('Sequelize object must be initalized', () => expect(sequelize).toBeTruthy())

test('User object must be initalized', () => expect(User).toBeTruthy())

test('Development database must be properly initialized', () => {
  expect(initSequelize()).resolves.toBeTruthy()
  expect(User.findOne({ where: { email: 'alvaro@basallo.es' } })).resolves.toBe(NonProductionFakeUser)
})
