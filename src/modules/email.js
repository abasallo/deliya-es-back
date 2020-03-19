import nodemailer from 'nodemailer'

export const nodemailerTransporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: true,
  auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASSWORD }
})

export const sendEmail = async (email, token) => {
  const EMAIL_FROM = 'Equipo deliya.es'
  const EMAIL_SUBJECT = 'Cambio de contraseña de deliya.es'
  const EMAIL_TEXT = `Por favor, visite el siguiente enlace: http://localhost:3000/password-change/${token}`
  const EMAIL_HTML = `<b>Por favor, visite el siguiente <a href="http://localhost:3000/password-change/${token}">enlace.</a></b>`

  try {
    await nodemailerTransporter.sendMail({ from: EMAIL_FROM, to: email, subject: EMAIL_SUBJECT, text: EMAIL_TEXT, html: EMAIL_HTML })
    return true
  } catch (error) {
    return false
  }
}
