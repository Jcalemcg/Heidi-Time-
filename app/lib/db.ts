import Database from 'better-sqlite3'
import path from 'path'
import { mkdirSync } from 'fs'

let db: Database.Database | null = null

export function getDatabase(): Database.Database {
  if (db) return db

  const dbDir = path.join(process.cwd(), 'data')
  mkdirSync(dbDir, { recursive: true })

  db = new Database(path.join(dbDir, 'heidi.db'))

  // Enable foreign keys
  db.pragma('foreign_keys = ON')

  // Initialize schema
  initializeSchema(db)

  return db
}

function initializeSchema(db: Database.Database) {
  // Materials table - stores uploaded curriculum documents
  db.exec(`
    CREATE TABLE IF NOT EXISTS materials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      fileType TEXT NOT NULL,
      filePath TEXT NOT NULL,
      fileSize INTEGER,
      uploadedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      status TEXT DEFAULT 'processing'
    )
  `)

  // Document chunks table - stores parsed content from materials
  db.exec(`
    CREATE TABLE IF NOT EXISTS chunks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      materialId INTEGER NOT NULL,
      chunkIndex INTEGER NOT NULL,
      content TEXT NOT NULL,
      embedding BLOB,
      embeddingModel TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (materialId) REFERENCES materials(id) ON DELETE CASCADE
    )
  `)

  // Questions table - generated questions from materials
  db.exec(`
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      materialId INTEGER NOT NULL,
      chunkId INTEGER,
      question TEXT NOT NULL,
      answers TEXT NOT NULL,
      correctAnswer TEXT NOT NULL,
      explanation TEXT NOT NULL,
      sourceText TEXT,
      difficulty TEXT DEFAULT 'medium',
      topic TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (materialId) REFERENCES materials(id) ON DELETE CASCADE,
      FOREIGN KEY (chunkId) REFERENCES chunks(id) ON DELETE SET NULL
    )
  `)

  // User progress table - tracks user performance
  db.exec(`
    CREATE TABLE IF NOT EXISTS userProgress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      questionId INTEGER NOT NULL,
      isCorrect INTEGER,
      timeSpent INTEGER,
      attemptedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (questionId) REFERENCES questions(id) ON DELETE CASCADE
    )
  `)

  // Create indexes for performance
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_chunks_materialId ON chunks(materialId);
    CREATE INDEX IF NOT EXISTS idx_questions_materialId ON questions(materialId);
    CREATE INDEX IF NOT EXISTS idx_questions_chunkId ON questions(chunkId);
    CREATE INDEX IF NOT EXISTS idx_userProgress_questionId ON userProgress(questionId);
  `)
}

export function closeDatabase() {
  if (db) {
    db.close()
    db = null
  }
}
