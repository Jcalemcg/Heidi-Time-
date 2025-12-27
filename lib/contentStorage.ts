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
  // Validate inputs
  if (!title || typeof title !== "string") {
    throw new Error("Title must be a non-empty string");
  }
  if (!content || typeof content !== "string") {
    throw new Error("Content must be a non-empty string");
  }
  if (!fileType || typeof fileType !== "string") {
    throw new Error("File type must be a non-empty string");
  }

  const id = `content_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const stored: StoredContent = {
    id,
    title: title.trim(),
    content,
    fileType,
    uploadedAt: new Date(),
    size: content.length,
  };

  try {
    contentStore.set(id, stored);
  } catch (error) {
    throw new Error(
      `Failed to store content: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }

  return stored;
}

export function getContent(id: string): StoredContent | null {
  if (!id || typeof id !== "string") {
    throw new Error("Content ID must be a non-empty string");
  }
  return contentStore.get(id) || null;
}

export function listContent(): StoredContent[] {
  try {
    return Array.from(contentStore.values()).sort(
      (a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime()
    );
  } catch (error) {
    throw new Error(
      `Failed to list content: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

export function deleteContent(id: string): boolean {
  if (!id || typeof id !== "string") {
    throw new Error("Content ID must be a non-empty string");
  }

  try {
    contentStore.delete(id);
    materialsStore.delete(id);
    return true;
  } catch (error) {
    throw new Error(
      `Failed to delete content: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

export function storeMaterials(materials: GeneratedMaterials): void {
  if (!materials || typeof materials !== "object") {
    throw new Error("Materials must be an object");
  }
  if (!materials.contentId || typeof materials.contentId !== "string") {
    throw new Error("Materials must have a valid contentId");
  }
  if (!Array.isArray(materials.questions)) {
    throw new Error("Materials questions must be an array");
  }
  if (!Array.isArray(materials.flashcards)) {
    throw new Error("Materials flashcards must be an array");
  }

  try {
    materialsStore.set(materials.contentId, materials);
  } catch (error) {
    throw new Error(
      `Failed to store materials: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

export function getMaterials(contentId: string): GeneratedMaterials | null {
  if (!contentId || typeof contentId !== "string") {
    throw new Error("Content ID must be a non-empty string");
  }
  return materialsStore.get(contentId) || null;
}

export function clearAllContent(): void {
  contentStore.clear();
  materialsStore.clear();
}
