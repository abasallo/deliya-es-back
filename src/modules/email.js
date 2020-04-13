import constants from './constants'

import nodemailer from 'nodemailer'

export const nodemailerTransporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: true,
  auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASSWORD }
})

export const composePasswordRecoveryUrl = (env, productionString, token) => {
  const urlBase = constants.PASSWORD_CHANGE_EMAIL_TEXT
  if (env === productionString) {
    return urlBase + ` https://${process.env.FRONTEND_URL}/password-change/${token}`
  }
  return urlBase + ` http://${process.env.FRONTEND_URL}:${process.env.FRONTEND_PORT}/password-change/${token}`
}

export const sendEmail = (email, token) =>
  nodemailerTransporter.sendMail({
    from: constants.PASSWORD_CHANGE_EMAIL_FROM,
    to: email,
    subject: constants.PASSWORD_CHANGE_EMAIL_SUBJECT,
    text: composePasswordRecoveryUrl(process.env.NODE_ENV, constants.NODE_PRODUCTION_STRING, token)
  })
