import nodemailer from 'nodemailer'

const MAIL_HOST = process.env.MAIL_HOST
const MAIL_PORT = process.env.MAIL_PORT
const MAIL_USER = process.env.MAIL_USER
const MAIL_PASSWORD = process.env.MAIL_PASSWORD

const EMAIL_FROM = 'Equipo deliya.es'
const EMAIL_SUBJECT = 'Cambio de contraseña de deliya.es'
const EMAIL_TEXT = token => `Por favor, visite el siguiente enlace: http://localhost:3000/password-change/${token}`
const EMAIL_HTML = token => `<b>Por favor, visite el siguiente <a href="http://localhost:3000/password-change/${token}">enlace.</a></b>`

export const nodemailerTransporter = nodemailer.createTransport({
  host: MAIL_HOST,
  port: MAIL_PORT,
  secure: true,
  auth: { user: MAIL_USER, pass: MAIL_PASSWORD }
})

export const sendEmail = async (email, token) =>
  nodemailerTransporter.sendMail({ from: EMAIL_FROM, to: email, subject: EMAIL_SUBJECT, text: EMAIL_TEXT(token), html: EMAIL_HTML(token) })
