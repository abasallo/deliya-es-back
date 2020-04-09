import nodemailer from 'nodemailer'

export const nodemailerTransporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: true,
  auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASSWORD }
})

export const sendEmail = (email, token) =>
  nodemailerTransporter.sendMail({
    from: process.env.PASSWORD_CHANGE_EMAIL_FROM,
    to: email,
    subject: process.env.PASSWORD_CHANGE_EMAIL_SUBJECT,
    text: process.env.PASSWORD_CHANGE_EMAIL_TEXT + token
  })
