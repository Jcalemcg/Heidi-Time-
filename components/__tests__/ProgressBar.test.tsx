import { render, screen } from '@testing-library/react'
import { ProgressBar } from '../ProgressBar'

describe('ProgressBar Component', () => {
  it('renders progress bar with correct current and total', () => {
    render(<ProgressBar current={3} total={10} label="Progress" />)
    expect(screen.getByText('Progress')).toBeInTheDocument()
    expect(screen.getByText('3 / 10')).toBeInTheDocument()
  })

  it('calculates percentage correctly', () => {
    const { container } = render(<ProgressBar current={5} total={10} />)
    const progressDiv = container.querySelector('div[style*="width"]')
    expect(progressDiv).toHaveStyle('width: 50%')
  })

  it('renders with 100% progress when current equals total', () => {
    const { container } = render(<ProgressBar current={10} total={10} />)
    const progressDiv = container.querySelector('div[style*="width"]')
    expect(progressDiv).toHaveStyle('width: 100%')
  })

  it('renders without label when label prop is not provided', () => {
    const { container } = render(<ProgressBar current={1} total={10} />)
    const textElements = container.querySelectorAll('.text-slate-400')
    expect(textElements.length).toBe(0)
  })
})
