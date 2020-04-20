import { database, model, server } from '../src/server-helper'

import { createApolloFetch } from 'apollo-fetch'

import { generateTokenFromEmailAndTTL } from '../src/modules/crypto'

let fetch
beforeAll(async () => {
  await model
  fetch = await createApolloFetch({ uri: `http://${process.env.HOST}:${process.env.PORT}/graphql` })
  await server.listen({ port: process.env.PORT })
})

afterAll(async () => {
  await (await database).close()
  await server.stop()
})

test('Check existing user existence', async () => {
  expect(
    await fetch({
      query: 'query($email: String) { doesUserExists(email: $email) }',
      variables: { email: 'user@host.tld' }
    })
  ).toMatchSnapshot()
})

test('Check non existing user existence', async () => {
  expect(
    await fetch({
      query: 'query($email: String) { doesUserExists(email: $email) }',
      variables: { email: 'inexistentUser@host.tld' }
    })
  ).toMatchSnapshot()
})

test('Login with user and password', async () => {
  expect(
    await fetch({
      query: 'query($email: String, $password: String) { login(email: $email, password: $password) }',
      variables: { email: 'user@host.tld', password: 'password' }
    })
  ).toMatchSnapshot({ data: { login: expect.any(String) } })
})

test('Login with user and password, but deactivated', async () => {
  expect(
    await fetch({
      query: 'query($email: String, $password: String) { login(email: $email, password: $password) }',
      variables: { email: 'userDeactivated@host.tld', password: 'password' }
    })
  ).toMatchSnapshot()
})

test('Login with user and incorrect password', async () => {
  expect(
    await fetch({
      query: 'query($email: String, $password: String) { login(email: $email, password: $password) }',
      variables: { email: 'user@host.tld', password: 'wrongPassword' }
    })
  ).toMatchSnapshot()
})

test('Request password recovery', async () => {
  expect(
    await fetch({
      query: 'query($email: String) { requestPasswordRecoveryUrlOverEmail(email: $email) }',
      variables: { email: 'user@host.tld' }
    })
  ).toMatchSnapshot()
})

test('Request password recovery with nonexistent email', async () => {
  expect(
    await fetch({
      query: 'query($email: String) { requestPasswordRecoveryUrlOverEmail(email: $email) }',
      variables: { email: 'inexistentUser@host.tld' }
    })
  ).toMatchSnapshot()
})

test('Request user activation', async () => {
  expect(
    await fetch({
      query: 'query($email: String) { requestUserActivationUrlOverEmail(email: $email) }',
      variables: { email: 'user@host.tld' }
    })
  ).toMatchSnapshot()
})

test('Request user activation with nonexistent email', async () => {
  expect(
    await fetch({
      query: 'query($email: String) { requestUserActivationUrlOverEmail(email: $email) }',
      variables: { email: 'inexistentUser@host.tld' }
    })
  ).toMatchSnapshot()
})

test('Add user', async () => {
  expect(
    await fetch({
      query: `mutation($names: String, $surnames: String, $email: String!, $password: String!, $isEmailContactAllowed: Boolean!) {
                addUser(user: { names: $names, surnames: $surnames, email: $email, password: $password, isEmailContactAllowed: $isEmailContactAllowed }) {
                  id
                  names
                  surnames
                  email
                  password
                  isEmailContactAllowed
                }
      }`,
      variables: { names: 'names', surnames: 'surnames', email: 'email', password: 'password', isEmailContactAllowed: true }
    })
  ).toMatchSnapshot({ data: { addUser: { id: expect.any(String), password: expect.any(String) } } })
})

test('Activate User with token', async () => {
  expect(
    await fetch({
      query: 'mutation($token: String) { activateUser(token: $token) }',
      variables: { token: await generateTokenFromEmailAndTTL('user@host.tld') }
    })
  ).toMatchSnapshot()
})

test('Activate User with wrong, or expired, token', async () => {
  expect(
    await fetch({ query: 'mutation($token: String) { activateUser(token: $token) }', variables: { token: 'wrong' } })
  ).toMatchSnapshot()
})

test('Change password with token', async () => {
  expect(
    await fetch({
      query: 'mutation($password: String, $token: String) { changePasswordWithToken(password: $password, token: $token) }',
      variables: { password: 'newPassword', token: await generateTokenFromEmailAndTTL('user@host.tld') }
    })
  ).toMatchSnapshot()
})

test('Change password with wrong, or expired, token', async () => {
  expect(
    await fetch({
      query: 'mutation($password: String, $token: String) { changePasswordWithToken(password: $password, token: $token) }',
      variables: { password: 'newPassword', token: 'wrong' }
    })
  ).toMatchSnapshot()
})
