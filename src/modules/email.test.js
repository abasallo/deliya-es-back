import 'dotenv/config'

import { nodemailerTransporter, sendEmail } from './email'

jest.mock('nodemailer', () => ({ createTransport: _ => _ }))

test('Nodemailer should be properly configured', () => {
  expect(nodemailerTransporter).toStrictEqual({
    host: 'smtp.gmail.com',
    port: '465',
    secure: true,
    auth: {
      user: 'smtp@basallo.es',
      pass: 'WMyuhgPCQQiMkOqeCpPBCL$iEi&KTpG3QE..og0*b$U%8Gd$l8gz@Gpp1X0YkdhMId0iW2B7oDPeTp$YB$!PzfOoISYIKZ^r5xbA'
    }
  })
})

test('Sendemail should be called with appropriate email data pieces', () => {
  const email = 'email'
  const token = 'token'

  const EMAIL_FROM = 'Equipo deliya.es'
  const EMAIL_SUBJECT = 'Cambio de contraseña de deliya.es'
  const EMAIL_TEXT = `Por favor, visite el siguiente enlace: http://localhost:3000/password-change/${token}`
  const EMAIL_HTML = `<b>Por favor, visite el siguiente <a href="http://localhost:3000/password-change/${token}">enlace.</a></b>`

  nodemailerTransporter.sendMail = _ => Promise.resolve(_)

  expect(sendEmail('email', 'token')).resolves.toStrictEqual({
    from: EMAIL_FROM,
    to: email,
    subject: EMAIL_SUBJECT,
    text: EMAIL_TEXT,
    html: EMAIL_HTML
  })
})
