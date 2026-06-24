import { z } from 'zod'

export const waitlistRequestSchema = z
  .strictObject({
    name: z.string().trim().min(1).max(100),
    email: z.string().trim().toLowerCase().email().max(254),
    website: z.string().max(200).optional().default(''),
  })
  .transform(({ name, email, website }) => ({
    name: name.replace(/\s+/g, ' '),
    email,
    website,
  }))

export type WaitlistRequest = z.infer<typeof waitlistRequestSchema>
