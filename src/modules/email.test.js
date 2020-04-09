import 'dotenv/config'

import { nodemailerTransporter, sendEmail } from './email'

jest.mock('nodemailer', () => ({ createTransport: _ => _ }))

test('Nodemailer should be properly configured', async () => {
  expect(nodemailerTransporter.host).toBe(process.env.MAIL_HOST)
  expect(nodemailerTransporter.port).toBe(process.env.MAIL_PORT)
  expect(nodemailerTransporter.secure).toBeTruthy()
  expect(nodemailerTransporter.auth.user).toBe(process.env.MAIL_USER)
  expect(nodemailerTransporter.auth.pass).toBe(process.env.MAIL_PASSWORD)
})

test('Sendemail should be called with appropriate email data pieces', async () => {
  nodemailerTransporter.sendMail = _ => Promise.resolve(_)
  const sendEmailResult = await sendEmail('email', 'token')
  const passwordChangeEmailText = process.env.PASSWORD_CHANGE_EMAIL_TEXT
  expect(sendEmailResult.from).toBe(process.env.PASSWORD_CHANGE_EMAIL_FROM)
  expect(sendEmailResult.to).toBe('email')
  expect(sendEmailResult.subject).toBe(process.env.PASSWORD_CHANGE_EMAIL_SUBJECT)
  expect(sendEmailResult.text).toBe(passwordChangeEmailText + 'token')
})
