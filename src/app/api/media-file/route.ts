import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

function isAllowedKey(key: string): boolean {
  return (
    key.startsWith('website/media/') &&
    !key.includes('..') &&
    !key.startsWith('/') &&
    key.length <= 500
  )
}

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key') || ''
  const region = process.env.AWS_REGION
  const bucket = process.env.AWS_S3_BUCKET
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

  if (!isAllowedKey(key)) {
    return NextResponse.json({ error: 'Invalid media file.' }, { status: 400 })
  }
  if (!region || !bucket || !accessKeyId || !secretAccessKey) {
    return NextResponse.json({ error: 'Media storage is not configured.' }, { status: 503 })
  }

  try {
    const s3 = new S3Client({
      region,
      credentials: { accessKeyId, secretAccessKey },
    })
    const object = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }))
    if (!object.Body) {
      return NextResponse.json({ error: 'Media file not found.' }, { status: 404 })
    }

    const body = await object.Body.transformToByteArray()
    return new Response(new Uint8Array(body), {
      headers: {
        'Content-Type': object.ContentType || 'application/octet-stream',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': String(body.byteLength),
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (error) {
    const status = error instanceof Error && error.name === 'NoSuchKey' ? 404 : 500
    return NextResponse.json(
      { error: status === 404 ? 'Media file not found.' : 'Could not load media file.' },
      { status },
    )
  }
}
