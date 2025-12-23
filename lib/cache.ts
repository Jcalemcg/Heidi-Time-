import Database from "better-sqlite3";
import * as fs from "fs";
import * as path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "cache.db");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

class CacheManager {
  private db: Database.Database;

  constructor() {
    this.db = new Database(DB_PATH);
    this.initializeTables();
  }

  private initializeTables() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS cached_content (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT UNIQUE NOT NULL,
        value TEXT NOT NULL,
        expiresAt DATETIME,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        credits INTEGER,
        clinicalHours INTEGER,
        description TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS questions (
        id TEXT PRIMARY KEY,
        courseCode TEXT NOT NULL,
        domain TEXT,
        question TEXT NOT NULL,
        options TEXT NOT NULL,
        correctAnswer INTEGER,
        rationale TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(courseCode) REFERENCES courses(code)
      );

      CREATE TABLE IF NOT EXISTS flashcards (
        id TEXT PRIMARY KEY,
        courseCode TEXT NOT NULL,
        front TEXT NOT NULL,
        back TEXT NOT NULL,
        category TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(courseCode) REFERENCES courses(code)
      );

      CREATE TABLE IF NOT EXISTS scrape_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        url TEXT NOT NULL,
        status TEXT,
        content TEXT,
        scrapedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }

  // Cache operations
  get<T>(key: string): T | null {
    try {
      const stmt = this.db.prepare(
        "SELECT value, expiresAt FROM cached_content WHERE key = ?"
      );
      const result = stmt.get(key) as any;

      if (!result) return null;

      if (result.expiresAt && new Date(result.expiresAt) < new Date()) {
        this.delete(key);
        return null;
      }

      return JSON.parse(result.value);
    } catch (error) {
      console.error(`Error getting cache key ${key}:`, error);
      return null;
    }
  }

  set<T>(key: string, value: T, ttlMinutes?: number) {
    try {
      const expiresAt = ttlMinutes
        ? new Date(Date.now() + ttlMinutes * 60000)
        : null;

      const stmt = this.db.prepare(
        "INSERT OR REPLACE INTO cached_content (key, value, expiresAt) VALUES (?, ?, ?)"
      );
      stmt.run(key, JSON.stringify(value), expiresAt?.toISOString() || null);
    } catch (error) {
      console.error(`Error setting cache key ${key}:`, error);
    }
  }

  delete(key: string) {
    try {
      const stmt = this.db.prepare("DELETE FROM cached_content WHERE key = ?");
      stmt.run(key);
    } catch (error) {
      console.error(`Error deleting cache key ${key}:`, error);
    }
  }

  clear() {
    try {
      this.db.prepare("DELETE FROM cached_content").run();
    } catch (error) {
      console.error("Error clearing cache:", error);
    }
  }

  // Course operations
  saveCourse(code: string, name: string, credits: number, clinicalHours: number, description?: string) {
    try {
      const stmt = this.db.prepare(
        "INSERT OR REPLACE INTO courses (code, name, credits, clinicalHours, description) VALUES (?, ?, ?, ?, ?)"
      );
      stmt.run(code, name, credits, clinicalHours, description || "");
    } catch (error) {
      console.error(`Error saving course ${code}:`, error);
    }
  }

  getCourse(code: string) {
    try {
      const stmt = this.db.prepare("SELECT * FROM courses WHERE code = ?");
      return stmt.get(code);
    } catch (error) {
      console.error(`Error getting course ${code}:`, error);
      return null;
    }
  }

  getAllCourses() {
    try {
      const stmt = this.db.prepare("SELECT * FROM courses ORDER BY code");
      return stmt.all();
    } catch (error) {
      console.error("Error getting all courses:", error);
      return [];
    }
  }

  // Question operations
  saveQuestion(question: any) {
    try {
      const stmt = this.db.prepare(
        "INSERT OR REPLACE INTO questions (id, courseCode, domain, question, options, correctAnswer, rationale) VALUES (?, ?, ?, ?, ?, ?, ?)"
      );
      stmt.run(
        question.id,
        question.courseCode,
        question.domain,
        question.question,
        JSON.stringify(question.options),
        question.correctAnswer,
        question.rationale || ""
      );
    } catch (error) {
      console.error(`Error saving question:`, error);
    }
  }

  getQuestionsByCourse(courseCode: string) {
    try {
      const stmt = this.db.prepare(
        "SELECT * FROM questions WHERE courseCode = ? ORDER BY domain"
      );
      const results = stmt.all(courseCode) as any[];
      return results.map((q) => ({
        ...q,
        options: JSON.parse(q.options),
      }));
    } catch (error) {
      console.error(`Error getting questions for ${courseCode}:`, error);
      return [];
    }
  }

  // Flashcard operations
  saveFlashcard(flashcard: any) {
    try {
      const stmt = this.db.prepare(
        "INSERT OR REPLACE INTO flashcards (id, courseCode, front, back, category) VALUES (?, ?, ?, ?, ?)"
      );
      stmt.run(
        flashcard.id,
        flashcard.courseCode,
        flashcard.front,
        flashcard.back,
        flashcard.category || ""
      );
    } catch (error) {
      console.error(`Error saving flashcard:`, error);
    }
  }

  getFlashcardsByCourse(courseCode: string) {
    try {
      const stmt = this.db.prepare(
        "SELECT * FROM flashcards WHERE courseCode = ?"
      );
      return stmt.all(courseCode);
    } catch (error) {
      console.error(`Error getting flashcards for ${courseCode}:`, error);
      return [];
    }
  }

  getAllFlashcards() {
    try {
      const stmt = this.db.prepare("SELECT * FROM flashcards ORDER BY courseCode");
      return stmt.all();
    } catch (error) {
      console.error("Error getting all flashcards:", error);
      return [];
    }
  }

  // Scrape history
  recordScrape(url: string, status: string, content?: string) {
    try {
      const stmt = this.db.prepare(
        "INSERT INTO scrape_history (url, status, content) VALUES (?, ?, ?)"
      );
      stmt.run(url, status, content || "");
    } catch (error) {
      console.error(`Error recording scrape for ${url}:`, error);
    }
  }

  close() {
    this.db.close();
  }
}

export default CacheManager;
