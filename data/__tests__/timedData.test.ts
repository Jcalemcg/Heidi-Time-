import { timedData } from '../timedData'

describe('Timed Data', () => {
  it('should have at least 20 timed questions', () => {
    expect(timedData.length).toBeGreaterThanOrEqual(20)
  })

  it('each question should have required fields', () => {
    timedData.forEach((question) => {
      expect(question).toHaveProperty('id')
      expect(question).toHaveProperty('question')
      expect(question).toHaveProperty('options')
      expect(question).toHaveProperty('correctAnswer')
      expect(question).toHaveProperty('topic')
    })
  })

  it('each question should have 4 options', () => {
    timedData.forEach((question) => {
      expect(question.options.length).toBe(4)
    })
  })

  it('correctAnswer should be a valid option index', () => {
    timedData.forEach((question) => {
      expect(question.correctAnswer).toBeGreaterThanOrEqual(0)
      expect(question.correctAnswer).toBeLessThan(question.options.length)
    })
  })

  it('all question IDs should be unique', () => {
    const ids = timedData.map((q) => q.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })

  it('should have non-empty questions and options', () => {
    timedData.forEach((question) => {
      expect(question.question).not.toBe('')
      question.options.forEach((option) => {
        expect(option).not.toBe('')
      })
    })
  })
})
