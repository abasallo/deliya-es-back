import 'dotenv/config'

import constants from './constants'

import { nodemailerTransporter, composePasswordRecoveryUrl, sendEmail } from './email'

jest.mock('nodemailer', () => ({ createTransport: _ => _ }))

test('Nodemailer should be properly configured', async () => {
  expect(nodemailerTransporter.host).toBe(process.env.MAIL_HOST)
  expect(nodemailerTransporter.port).toBe(process.env.MAIL_PORT)
  expect(nodemailerTransporter.secure).toBeTruthy()
  expect(nodemailerTransporter.auth.user).toBe(process.env.MAIL_USER)
  expect(nodemailerTransporter.auth.pass).toBe(process.env.MAIL_PASSWORD)
})

test('Production password recovery URL should be properly composed', () =>
  expect(composePasswordRecoveryUrl('production', 'production', 'token')).toEqual(
    constants.PASSWORD_CHANGE_EMAIL_TEXT + ` https://${process.env.FRONTEND_HOST}/password-change/token`
  ))

test('Non production password recovery URL should be properly composed', () =>
  expect(composePasswordRecoveryUrl('test', 'production', 'token')).toEqual(
    constants.PASSWORD_CHANGE_EMAIL_TEXT + ` http://${process.env.FRONTEND_HOST}:${process.env.FRONTEND_PORT}/password-change/token`
  ))

test('Sendemail should be called with appropriate email data pieces', async () => {
  nodemailerTransporter.sendMail = _ => Promise.resolve(_)
  const sendEmailResult = await sendEmail('email', 'token')
  expect(sendEmailResult.from).toBe(constants.PASSWORD_CHANGE_EMAIL_FROM)
  expect(sendEmailResult.to).toBe('email')
  expect(sendEmailResult.subject).toBe(constants.PASSWORD_CHANGE_EMAIL_SUBJECT)
  expect(sendEmailResult.text).toBe(composePasswordRecoveryUrl('test', constants.NODE_PRODUCTION_STRING, 'token'))
})
