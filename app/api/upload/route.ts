import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { getDatabase } from '@/app/lib/db'
import { parsePdf, parseTextFile, chunkText } from '@/app/lib/pdfParser'
import { generateEmbedding } from '@/app/lib/embeddings'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const title = formData.get('title') as string
    const description = formData.get('description') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!title) {
      return NextResponse.json({ error: 'No title provided' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'text/plain']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Only PDF and text files are supported' }, { status: 400 })
    }

    // Create uploads directory
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadsDir, { recursive: true })

    // Save file
    const filename = `${Date.now()}-${file.name}`
    const filePath = path.join(uploadsDir, filename)
    const bytes = await file.arrayBuffer()
    await writeFile(filePath, Buffer.from(bytes))

    // Parse document
    let parsedDoc
    if (file.type === 'application/pdf') {
      parsedDoc = await parsePdf(filePath)
    } else {
      parsedDoc = await parseTextFile(filePath)
    }

    // Save material to database
    const db = getDatabase()
    const insertMaterial = db.prepare(`
      INSERT INTO materials (title, description, fileType, filePath, fileSize, status)
      VALUES (?, ?, ?, ?, ?, 'processing')
    `)

    const result = insertMaterial.run(title, description || null, file.type, `/uploads/${filename}`, file.size)
    const materialId = result.lastInsertRowid as number

    // Chunk document
    const chunks = chunkText(parsedDoc.text, 500, 100)

    // Process chunks with embeddings
    const insertChunk = db.prepare(`
      INSERT INTO chunks (materialId, chunkIndex, content, embedding, embeddingModel)
      VALUES (?, ?, ?, ?, 'sentence-transformers/all-MiniLM-L6-v2')
    `)

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i]
      try {
        const embedding = await generateEmbedding(chunk)
        const embeddingBuffer = Buffer.from(new Float32Array(embedding).buffer)
        insertChunk.run(materialId, i, chunk, embeddingBuffer)
      } catch (embedError) {
        console.error(`Error embedding chunk ${i}:`, embedError)
        // Continue without embedding if it fails - content is still searchable
        insertChunk.run(materialId, i, chunk, null)
      }
    }

    // Update status to ready
    db.prepare('UPDATE materials SET status = ? WHERE id = ?').run('ready', materialId)

    return NextResponse.json({
      success: true,
      material: {
        id: materialId,
        title,
        description,
        fileType: file.type,
        fileSize: file.size,
        pages: parsedDoc.metadata.pages,
        chunks: chunks.length,
      },
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to process file', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
