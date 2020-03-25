import configCallResult from './dotenv'

jest.mock('dotenv', () => ({ config: _ => 'configResult' }))

test('Dotenv should be initialized', () => {
  expect(configCallResult).toBe('configResult')
})
