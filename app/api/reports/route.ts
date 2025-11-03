import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const data = await req.json()

    const report = await prisma.report.create({
      data: {
        wasteType: data.wasteType,
        description: data.description,
        latitude: data.latitude,
        longitude: data.longitude,
        imageUrl: data.imageUrl || null,
      },
    })

    return NextResponse.json({ success: true, report })
  } catch (error) {
    console.error('Ошибка при создании отчета:', error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
