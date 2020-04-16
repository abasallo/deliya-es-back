import 'dotenv/config'

import constants from './constants'

import {
  nodemailerTransporter,
  composeTokenUrl,
  composePasswordRecoveryUrl,
  composeUserActivationUrl,
  sendEmail,
  sendPasswordRecoveryEmail,
  sendActivationRecoveryEmail
} from './email'

jest.mock('nodemailer', () => ({ createTransport: _ => _ }))

test('Nodemailer should be properly configured', async () => {
  expect(nodemailerTransporter.host).toBe(process.env.MAIL_HOST)
  expect(nodemailerTransporter.port).toBe(process.env.MAIL_PORT)
  expect(nodemailerTransporter.secure).toBeTruthy()
  expect(nodemailerTransporter.auth.user).toBe(process.env.MAIL_USER)
  expect(nodemailerTransporter.auth.pass).toBe(process.env.MAIL_PASSWORD)
})

test('URL should be properly composed based on provided parameters, for production', () =>
  expect(composeTokenUrl('token', 'production', 'production', 'urlText')).toEqual(
    constants.PASSWORD_CHANGE_EMAIL_TEXT + ` https://${process.env.FRONTEND_HOST}/urlText/token`
  ))

test('URL should be properly composed based on provided parameters, for non production envs', () =>
  expect(composeTokenUrl('token', 'test', 'production', 'urlText')).toEqual(
    constants.PASSWORD_CHANGE_EMAIL_TEXT + ` http://${process.env.FRONTEND_HOST}:${process.env.FRONTEND_PORT}/urlText/token`
  ))

test('URL should be properly composed based on provided parameters, for password recovery', () =>
  expect(composePasswordRecoveryUrl('token', 'env', 'production')).toEqual(
    constants.PASSWORD_CHANGE_EMAIL_TEXT +
      ` http://${process.env.FRONTEND_HOST}:${process.env.FRONTEND_PORT}/${constants.PASSWORD_CHANGE_URL}/token`
  ))

test('URL should be properly composed based on provided parameters, for user activation', () =>
  expect(composeUserActivationUrl('token', 'env', 'production')).toEqual(
    constants.PASSWORD_CHANGE_EMAIL_TEXT +
      ` http://${process.env.FRONTEND_HOST}:${process.env.FRONTEND_PORT}/${constants.USER_ACTIVATION_URL}/token`
  ))

test('Email should be sent with the provided parameters', async () => {
  nodemailerTransporter.sendMail = _ => Promise.resolve(_)
  const result = await sendEmail('token', 'email', 'subject', 'text')
  expect(result.from).toBe(constants.EMAIL_FROM)
  expect(result.to).toBe('email')
  expect(result.subject).toBe('subject')
  expect(result.text).toBe('text')
})

test('Password recovery email should be sent', async () => {
  nodemailerTransporter.sendMail = _ => Promise.resolve(_)
  const result = await sendPasswordRecoveryEmail('token', 'email')
  expect(result.text).toContain(constants.PASSWORD_CHANGE_URL)
})

test('User activation email should be sent', async () => {
  nodemailerTransporter.sendMail = _ => Promise.resolve(_)
  const result = await sendActivationRecoveryEmail('token', 'email')
  expect(result.text).toContain(constants.USER_ACTIVATION_URL)
})
