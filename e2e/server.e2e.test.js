import { model, server } from '../src/server-helper'

import { createApolloFetch } from 'apollo-fetch'

import jwt from 'jsonwebtoken'

let fetch
let apolloServer
beforeAll(async done => {
  fetch = await createApolloFetch({ uri: `http://${process.env.BACKEND_HOST}:${process.env.BACKEND_PORT}/graphql` })
  await model.then(() =>
    server.listen({ port: process.env.BACKEND_PORT }).then(_ => {
      apolloServer = _
      done()
    })
  )
})

afterAll(async () => await apolloServer.server.close())

test('Login with user and password', async () => {
  expect(
    await fetch({
      query: 'query($email: String, $password: String) { login(email: $email, password: $password) }',
      variables: { email: 'user@host.tld', password: 'password' }
    })
  ).toMatchSnapshot({ data: { login: expect.any(String) } })
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

test('Change password with token', async () => {
  const token = await jwt.sign({ email: 'alvaro@basallo.es', date: Date.now() }, process.env.JWT_SECRET, { expiresIn: '10m' })
  expect(
    await fetch({
      query: 'mutation($password: String, $token: String) { changePasswordWithToken(password: $password, token: $token) }',
      variables: { password: 'newPassword', token: token }
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
