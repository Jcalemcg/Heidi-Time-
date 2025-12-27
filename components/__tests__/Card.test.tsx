import { render, screen } from '@testing-library/react'
import { Card } from '../Card'

describe('Card Component', () => {
  it('renders card with children', () => {
    render(<Card>Test content</Card>)
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('has glassmorphism class', () => {
    const { container } = render(<Card>Content</Card>)
    const card = container.firstChild
    expect(card).toHaveClass('glassmorphism')
  })

  it('applies animation class when animate is fade-in', () => {
    const { container } = render(<Card animate="fade-in">Content</Card>)
    const card = container.firstChild
    expect(card).toHaveClass('animate-fade-in')
  })

  it('applies slide animation class', () => {
    const { container } = render(<Card animate="slide">Content</Card>)
    const card = container.firstChild
    expect(card).toHaveClass('animate-slide')
  })

  it('applies custom className', () => {
    const { container } = render(<Card className="custom-class">Content</Card>)
    const card = container.firstChild
    expect(card).toHaveClass('custom-class')
  })

  it('has no animation class when animate is none', () => {
    const { container } = render(<Card animate="none">Content</Card>)
    const card = container.firstChild
    expect(card).not.toHaveClass('animate-fade-in')
    expect(card).not.toHaveClass('animate-slide')
  })
})
