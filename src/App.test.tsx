import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { pickLocale } from './i18n/locales'
import { pickColorMode } from './lib/theme'

describe('preferences', () => {
  it('prefers the saved value over the system', () => {
    expect(pickColorMode('light', true)).toBe('light')
    expect(pickColorMode(null, true)).toBe('dark')
    expect(pickLocale('es', ['en-US'])).toBe('es')
    expect(pickLocale(null, ['fr', 'es-CL'])).toBe('es')
    expect(pickLocale(null, ['fr'])).toBe('en')
  })
})

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.stubGlobal('matchMedia', () => ({ matches: false }))
    vi.spyOn(window.navigator, 'languages', 'get').mockReturnValue(['en-US'])
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('switches language and keeps it', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: 'Start' })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'ES' }))
    expect(screen.getByRole('button', { name: 'Empezar' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Trabajo' })).toBeTruthy()
    expect(document.documentElement.lang).toBe('es')
    expect(localStorage.getItem('preferred-lang')).toBe('es')
  })

  it('closes settings when tapping outside, not when dragging out of the panel', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Settings' }))
    const backdrop = screen.getByTestId('settings-backdrop')

    fireEvent.pointerDown(screen.getByText('Background'))
    fireEvent.click(backdrop)
    expect(screen.queryByTestId('settings-backdrop')).toBeTruthy()

    fireEvent.pointerDown(backdrop)
    fireEvent.click(backdrop)
    expect(screen.queryByTestId('settings-backdrop')).toBeNull()
  })

  it('offers the floating timer only when the browser supports it', () => {
    const name = 'Open floating timer'
    const { unmount } = render(<App />)
    expect(screen.queryByRole('button', { name })).toBeNull()
    unmount()

    Object.defineProperty(document, 'pictureInPictureEnabled', { configurable: true, value: true })
    Object.defineProperty(HTMLCanvasElement.prototype, 'captureStream', {
      configurable: true,
      value: vi.fn(),
    })
    render(<App />)
    expect(screen.getByRole('button', { name })).toBeTruthy()
    Reflect.deleteProperty(document, 'pictureInPictureEnabled')
    Reflect.deleteProperty(HTMLCanvasElement.prototype, 'captureStream')
  })

  it('pauses and resumes from the same time', () => {
    vi.useFakeTimers()
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Start' }))
    act(() => {
      vi.advanceTimersByTime(10000)
    })
    fireEvent.click(screen.getByRole('button', { name: 'Pause' }))
    act(() => {
      vi.advanceTimersByTime(30000)
    })
    expect(screen.getByText('24:50')).toBeTruthy()
    expect(screen.getByText('Paused')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Resume' }))
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(screen.getByText('24:45')).toBeTruthy()
    vi.useRealTimers()
  })

  it('adds and removes a music link', () => {
    render(<App />)
    const input = screen.getByLabelText('Your music')

    fireEvent.change(input, { target: { value: 'https://evil.io/x' } })
    fireEvent.click(screen.getByRole('button', { name: 'Add' }))
    expect(screen.getByText('Use a YouTube, Spotify or SoundCloud link.')).toBeTruthy()
    expect(screen.queryByTitle('Your music')).toBeNull()

    fireEvent.change(input, { target: { value: 'https://youtu.be/jfKfPfyJRdk' } })
    fireEvent.click(screen.getByRole('button', { name: 'Add' }))
    expect(screen.getByTitle('Your music').getAttribute('src')).toBe(
      'https://www.youtube-nocookie.com/embed/jfKfPfyJRdk',
    )

    fireEvent.click(screen.getByRole('button', { name: 'Remove' }))
    expect(screen.queryByTitle('Your music')).toBeNull()
  })

  it('toggles the color mode and keeps it', () => {
    render(<App />)
    expect(document.documentElement.dataset.theme).toBe('light')
    fireEvent.click(screen.getByRole('button', { name: 'Switch to dark mode' }))
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(localStorage.getItem('color-mode')).toBe('dark')
  })
})
