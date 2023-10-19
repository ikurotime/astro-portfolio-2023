import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Resend } from 'resend'

export default async function (
  request: VercelRequest,
  response: VercelResponse
) {
  response.setHeader('Content-Type', 'application/json')

  const resend = new Resend('re_bZLH5vqf_2ACVa434vXyMRyw68my9QAiu')

  resend.emails.send({
    from: 'onboarding@resend.dev',
    to: 'davidhuertasortiz@gmail.com',
    subject: 'Hello World',
    html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
  })

  response.status(200).send(
    JSON.stringify({
      message: 'Mensaje enviado'
    })
  )
}
