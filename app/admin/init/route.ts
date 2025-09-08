import { NextResponse } from 'next/server'
import { ensureIndexSettings } from '@/src/lib/algolia'

export async function POST() {
  try {
    await ensureIndexSettings()
    
    return NextResponse.json({ 
      success: true, 
      message: 'Algolia index settings configured successfully' 
    })
  } catch (error) {
    console.error('Failed to configure Algolia index:', error)
    return NextResponse.json(
      { error: 'Failed to configure Algolia index' },
      { status: 500 }
    )
  }
}
