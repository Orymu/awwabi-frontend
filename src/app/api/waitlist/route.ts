import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { getWaitlistConfig } from '@/lib/waitlist/config'
import { waitlistRequestSchema } from '@/lib/waitlist/schema'
import { submitWaitlist, WaitlistRateLimitError } from '@/lib/waitlist/submit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_REQUEST_BYTES = 8 * 1024

function errorResponse(status: number, code: string) {
  return NextResponse.json({ ok: false, error: { code } }, { status })
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) return forwardedFor.split(',')[0]?.trim()
  return request.headers.get('x-real-ip')?.trim()
}

export async function POST(request: Request) {
  if (!request.headers.get('content-type')?.startsWith('application/json')) {
    return errorResponse(415, 'UNSUPPORTED_CONTENT_TYPE')
  }

  const contentLength = Number(request.headers.get('content-length') ?? 0)
  if (contentLength > MAX_REQUEST_BYTES) {
    return errorResponse(413, 'PAYLOAD_TOO_LARGE')
  }

  try {
    const config = getWaitlistConfig()
    const origin = request.headers.get('origin')

    if (!origin || !config.allowedOrigins.includes(origin)) {
      return errorResponse(403, 'ORIGIN_NOT_ALLOWED')
    }

    const body = await request.text()
    if (Buffer.byteLength(body, 'utf8') > MAX_REQUEST_BYTES) {
      return errorResponse(413, 'PAYLOAD_TOO_LARGE')
    }

    const input = waitlistRequestSchema.parse(JSON.parse(body))

    // Silently accept bot submissions so the honeypot is not discoverable from
    // the response contract. Nothing is persisted.
    if (input.website) {
      return NextResponse.json({ ok: true }, { status: 202 })
    }

    const clientIp = getClientIp(request)
    if (!clientIp) return errorResponse(503, 'SERVICE_UNAVAILABLE')

    await submitWaitlist(
      { name: input.name, email: input.email, clientIp },
      config,
    )

    return NextResponse.json({ ok: true }, { status: 202 })
  } catch (error: unknown) {
    if (error instanceof SyntaxError || error instanceof ZodError) {
      return errorResponse(400, 'INVALID_INPUT')
    }

    if (error instanceof WaitlistRateLimitError) {
      return NextResponse.json(
        { ok: false, error: { code: 'RATE_LIMITED' } },
        {
          status: 429,
          headers: { 'Retry-After': String(error.retryAfterSeconds) },
        },
      )
    }

    console.error('Waitlist submission failed', {
      cause: error instanceof Error ? error.name : 'UnknownError',
    })
    return errorResponse(503, 'SERVICE_UNAVAILABLE')
  }
}
