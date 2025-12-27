import { flashcardData } from '../flashcardData'

describe('Flashcard Data', () => {
  it('should have at least 10 flashcards', () => {
    expect(flashcardData.length).toBeGreaterThanOrEqual(10)
  })

  it('each flashcard should have required fields', () => {
    flashcardData.forEach((card) => {
      expect(card).toHaveProperty('id')
      expect(card).toHaveProperty('question')
      expect(card).toHaveProperty('answer')
      expect(card).toHaveProperty('topic')
    })
  })

  it('all flashcard IDs should be unique', () => {
    const ids = flashcardData.map((card) => card.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })

  it('all flashcards should have non-empty question and answer', () => {
    flashcardData.forEach((card) => {
      expect(card.question).not.toBe('')
      expect(card.answer).not.toBe('')
    })
  })

  it('should have variety of topics', () => {
    const topics = new Set(flashcardData.map((card) => card.topic))
    expect(topics.size).toBeGreaterThan(1)
  })
})
