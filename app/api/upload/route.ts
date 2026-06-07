import { NextRequest, NextResponse } from 'next/server'
import { UploadApiResponse } from 'cloudinary'
import { cloudinary } from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get('image') as File | null
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  const buffer = Buffer.from(await file.arrayBuffer())

  const result = await new Promise<UploadApiResponse>((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: 'mnacar', resource_type: 'image' },
      (err, res) => (err || !res ? reject(err) : resolve(res))
    ).end(buffer)
  })

  return NextResponse.json({ url: result.secure_url, public_id: result.public_id })
}
