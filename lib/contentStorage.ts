/**
 * Simple in-memory content storage
 * In production, use a database like PostgreSQL or MongoDB
 */

export interface StoredContent {
  id: string;
  title: string;
  content: string;
  fileType: string;
  uploadedAt: Date;
  size: number;
}

export interface GeneratedMaterials {
  contentId: string;
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }>;
  flashcards: Array<{
    question: string;
    answer: string;
  }>;
  summary: string;
}

// In-memory storage (replace with database in production)
const contentStore = new Map<string, StoredContent>();
const materialsStore = new Map<string, GeneratedMaterials>();

export function storeContent(
  title: string,
  content: string,
  fileType: string
): StoredContent {
  const id = `content_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const stored: StoredContent = {
    id,
    title,
    content,
    fileType,
    uploadedAt: new Date(),
    size: content.length,
  };

  contentStore.set(id, stored);
  return stored;
}

export function getContent(id: string): StoredContent | null {
  return contentStore.get(id) || null;
}

export function listContent(): StoredContent[] {
  return Array.from(contentStore.values()).sort(
    (a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime()
  );
}

export function deleteContent(id: string): boolean {
  contentStore.delete(id);
  materialsStore.delete(id);
  return true;
}

export function storeMaterials(materials: GeneratedMaterials): void {
  materialsStore.set(materials.contentId, materials);
}

export function getMaterials(contentId: string): GeneratedMaterials | null {
  return materialsStore.get(contentId) || null;
}

export function clearAllContent(): void {
  contentStore.clear();
  materialsStore.clear();
}
