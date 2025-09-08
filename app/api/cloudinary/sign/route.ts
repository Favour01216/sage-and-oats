import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const { folder } = await request.json()
    
    const timestamp = Math.round(new Date().getTime() / 1000)
    const apiSecret = process.env.CLOUDINARY_API_SECRET!
    const apiKey = process.env.CLOUDINARY_API_KEY!
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!
    
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}`
    const signature = crypto
      .createHash('sha256')
      .update(paramsToSign + apiSecret)
      .digest('hex')
    
    return NextResponse.json({
      signature,
      timestamp,
      cloudName,
      apiKey,
      folder
    })
  } catch (error) {
    console.error('Cloudinary sign error:', error)
    return NextResponse.json(
      { error: 'Failed to generate signature' },
      { status: 500 }
    )
  }
}
