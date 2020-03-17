import nodemailer from 'nodemailer'

export const nodemailerTransporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASSWORD }
})

export const sendEmail = async (email, token) => {
  try {
    await nodemailerTransporter.sendMail({
      from: 'Equipo deliya.es',
      to: email,
      subject: 'Cambio de contraseña de deliya.es',
      text: `Por favor, visite el siguiente enlace: http://localhost:3000/password-change/${token}`,
      html: `<b>Por favor, visite el siguiente <a href="http://localhost:3000/password-change/${token}">enlace.</a></b>`
    })
    return true
  } catch (error) {
    return false
  }
}
