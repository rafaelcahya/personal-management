import { Inngest } from 'inngest'

export const inngest = new Inngest({
  id: 'personal-management',
  signingKey: process.env.INNGEST_SIGNING_KEY,
})
