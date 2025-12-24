import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/app/lib/db'

export async function GET(request: NextRequest) {
  try {
    const db = getDatabase()

    const materials = db.prepare(`
      SELECT
        m.id,
        m.title,
        m.description,
        m.fileType,
        m.filePath,
        m.fileSize,
        m.uploadedAt,
        m.status,
        COUNT(DISTINCT c.id) as chunkCount,
        COUNT(DISTINCT q.id) as questionCount
      FROM materials m
      LEFT JOIN chunks c ON m.id = c.materialId
      LEFT JOIN questions q ON m.id = q.materialId
      GROUP BY m.id
      ORDER BY m.uploadedAt DESC
    `).all() as any[]

    return NextResponse.json({
      success: true,
      materials,
    })
  } catch (error) {
    console.error('Error fetching materials:', error)
    return NextResponse.json(
      { error: 'Failed to fetch materials', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const materialId = searchParams.get('id')

    if (!materialId) {
      return NextResponse.json({ error: 'Material ID is required' }, { status: 400 })
    }

    const db = getDatabase()
    const result = db.prepare('DELETE FROM materials WHERE id = ?').run(materialId)

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Material not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Material deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting material:', error)
    return NextResponse.json(
      { error: 'Failed to delete material', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
