import './server'

import { createApolloFetch } from 'apollo-fetch'

import jwt from 'jsonwebtoken'

const fetch = createApolloFetch({ uri: 'http://localhost:4000/graphql' })

jest.setTimeout(30000)

test('Login with user and password', () =>
  expect(
    fetch({
      query: 'query($email: String, $password: String) { login(email: $email, password: $password) }',
      variables: { email: 'alvaro@basallo.es', password: 'ojete' }
    })
  ).resolves.toMatchSnapshot({ data: { login: expect.any(String) } }))

test('Login with user and incorrect password', () =>
  expect(
    fetch({
      query: 'query($email: String, $password: String) { login(email: $email, password: $password) }',
      variables: { email: 'alvaro@basallo.es', password: 'incorrect' }
    })
  ).resolves.toMatchSnapshot())

test('Request password recovery', () =>
  expect(
    fetch({
      query: 'query($email: String) { requestPasswordRecoveryUrlOverEmail(email: $email) }',
      variables: { email: 'alvaro@basallo.es' }
    })
  ).resolves.toMatchSnapshot())

test('Request password recovery with nonexistent email', () =>
  expect(
    fetch({
      query: 'query($email: String) { requestPasswordRecoveryUrlOverEmail(email: $email) }',
      variables: { email: 'nonexistent-test@host.tld' }
    })
  ).resolves.toMatchSnapshot())

const createUserQuery = `
mutation($names: String, $surnames: String, $email: String!, $password: String!, $isEmailContactAllowed: Boolean!) {
  addUser(user: { names: $names, surnames: $surnames, email: $email, password: $password, isEmailContactAllowed: $isEmailContactAllowed }) {
    id
    names
    surnames
    email
    password
    isEmailContactAllowed
  }
}`
test('Add user', () =>
  expect(
    fetch({
      query: createUserQuery,
      variables: { names: 'names', surnames: 'surnames', email: 'email', password: 'password', isEmailContactAllowed: true }
    })
  ).resolves.toMatchSnapshot({ data: { addUser: { password: expect.any(String) } } }))

jwt.sign({ email: 'alvaro@basallo.es', date: Date.now() }, process.env.JWT_SECRET, { expiresIn: '10m' })
test('Change password with token', async () =>
  expect(
    fetch({
      query: 'mutation($password: String, $token: String) { changePasswordWithToken(password: $password, token: $token) }',
      variables: {
        password: 'newPassword',
        token: await jwt.sign({ email: 'alvaro@basallo.es', date: Date.now() }, process.env.JWT_SECRET, { expiresIn: '10m' })
      }
    })
  ).resolves.toMatchSnapshot())

test('Change password with wrong, or expired, token', () =>
  expect(
    fetch({
      query: 'mutation($password: String, $token: String) { changePasswordWithToken(password: $password, token: $token) }',
      variables: { password: 'newPassword', token: 'wrong' }
    })
  ).resolves.toMatchSnapshot())
