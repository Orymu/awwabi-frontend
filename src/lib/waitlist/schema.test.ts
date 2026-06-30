import { describe, expect, it } from 'vitest'
import { waitlistRequestSchema } from '@/lib/waitlist/schema'

describe('waitlistRequestSchema', () => {
  it('normalizes valid input', () => {
    expect(
      waitlistRequestSchema.parse({
        name: '  Aisyah   Putri  ',
        email: '  AISYAH@EXAMPLE.COM ',
      }),
    ).toEqual({
      name: 'Aisyah Putri',
      email: 'aisyah@example.com',
      website: '',
    })
  })

  it('rejects unknown fields', () => {
    expect(() =>
      waitlistRequestSchema.parse({
        name: 'Aisyah',
        email: 'aisyah@example.com',
        projectId: 'another-product',
      }),
    ).toThrow()
  })

  it.each([
    { name: '', email: 'aisyah@example.com' },
    { name: 'A'.repeat(101), email: 'aisyah@example.com' },
    { name: 'Aisyah', email: 'not-an-email' },
    { name: 'Aisyah', email: `${'a'.repeat(250)}@example.com` },
  ])('rejects invalid input %#', (input) => {
    expect(() => waitlistRequestSchema.parse(input)).toThrow()
  })
})
