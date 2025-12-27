import { quizData } from '../quizData'

describe('Quiz Data', () => {
  it('should have at least 20 quiz questions', () => {
    expect(quizData.length).toBeGreaterThanOrEqual(20)
  })

  it('each question should have required fields', () => {
    quizData.forEach((question) => {
      expect(question).toHaveProperty('id')
      expect(question).toHaveProperty('question')
      expect(question).toHaveProperty('options')
      expect(question).toHaveProperty('correctAnswer')
      expect(question).toHaveProperty('explanation')
      expect(question).toHaveProperty('topic')
    })
  })

  it('each question should have 4 options', () => {
    quizData.forEach((question) => {
      expect(question.options.length).toBe(4)
    })
  })

  it('correctAnswer should be a valid option index', () => {
    quizData.forEach((question) => {
      expect(question.correctAnswer).toBeGreaterThanOrEqual(0)
      expect(question.correctAnswer).toBeLessThan(question.options.length)
    })
  })

  it('all question IDs should be unique', () => {
    const ids = quizData.map((q) => q.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })

  it('should have non-empty questions and explanations', () => {
    quizData.forEach((question) => {
      expect(question.question).not.toBe('')
      expect(question.explanation).not.toBe('')
      question.options.forEach((option) => {
        expect(option).not.toBe('')
      })
    })
  })
})
