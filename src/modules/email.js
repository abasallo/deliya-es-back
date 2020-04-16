import constants from './constants'

import nodemailer from 'nodemailer'

export const nodemailerTransporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: true,
  auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASSWORD }
})

export const composeTokenUrl = (token, env, productionString, urlText) => {
  const urlBase = constants.PASSWORD_CHANGE_EMAIL_TEXT
  if (env === productionString) {
    return urlBase + ` https://${process.env.FRONTEND_HOST}/${urlText}/${token}`
  }
  return urlBase + ` http://${process.env.FRONTEND_HOST}:${process.env.FRONTEND_PORT}/${urlText}/${token}`
}

export const composePasswordRecoveryUrl = (token, env, productionString) =>
  composeTokenUrl(token, env, productionString, constants.PASSWORD_CHANGE_URL)

export const composeUserActivationUrl = (token, env, productionString) =>
  composeTokenUrl(token, env, productionString, constants.USER_ACTIVATION_URL)

export const sendEmail = (token, email, subject, text) =>
  nodemailerTransporter.sendMail({
    from: constants.EMAIL_FROM,
    to: email,
    subject: subject,
    text: text
  })

export const sendPasswordRecoveryEmail = (token, email) =>
  sendEmail(
    token,
    email,
    constants.PASSWORD_CHANGE_EMAIL_SUBJECT,
    composePasswordRecoveryUrl(token, process.env.NODE_ENV, constants.NODE_PRODUCTION_STRING)
  )

export const sendActivationRecoveryEmail = (token, email) =>
  sendEmail(
    token,
    email,
    constants.USER_ACTIVATION_EMAIL_SUBJECT,
    composeUserActivationUrl(token, process.env.NODE_ENV, constants.NODE_PRODUCTION_STRING)
  )
