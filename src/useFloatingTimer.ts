import { useEffect, useRef, useState } from 'react'

const WIDTH = 640
const COMPACT_RATIO = 1

interface Frame {
  time: string
  label: string
  progress: number
  accent: string
}

function draw(canvas: HTMLCanvasElement, { time, label, progress, accent }: Frame) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const { width, height } = canvas
  const bar = Math.round(height * 0.06)
  ctx.fillStyle = '#17181c'
  ctx.fillRect(0, 0, width, height)
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#f2f2f4'
  const size = height * 0.32
  ctx.font = `bold ${size}px system-ui, sans-serif`
  const fit = Math.min(1, (width * 0.9) / ctx.measureText(time).width)
  ctx.font = `bold ${size * fit}px system-ui, sans-serif`
  ctx.fillText(time, width / 2, height * 0.43)
  ctx.fillStyle = '#a9abb5'
  ctx.font = `600 ${height * 0.1}px system-ui, sans-serif`
  ctx.fillText(label, width / 2, height * 0.72)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)'
  ctx.fillRect(0, height - bar, width, bar)
  ctx.fillStyle = accent
  ctx.fillRect(0, height - bar, width * progress, bar)
}

function metadataLoaded(video: HTMLVideoElement): Promise<void> {
  if (video.videoWidth) return Promise.resolve()
  return new Promise((resolve) => {
    video.addEventListener('loadedmetadata', () => resolve(), { once: true })
  })
}

export function floatingSupported(): boolean {
  return Boolean(document.pictureInPictureEnabled) && 'captureStream' in HTMLCanvasElement.prototype
}

export function useFloatingTimer(
  frame: Frame,
  running: boolean,
  onPlay: () => void,
  onPause: () => void,
  onError: () => void,
) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [active, setActive] = useState(false)
  const [ratio, setRatio] = useState(COMPACT_RATIO)
  const { time, label, progress, accent } = frame

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const enter = () => setActive(true)
    const leave = () => {
      setActive(false)
      video.pause()
    }
    video.addEventListener('enterpictureinpicture', enter)
    video.addEventListener('leavepictureinpicture', leave)
    return () => {
      video.removeEventListener('enterpictureinpicture', enter)
      video.removeEventListener('leavepictureinpicture', leave)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!active || !canvas) return
    canvas.height = Math.round(WIDTH / ratio)
    draw(canvas, { time, label, progress, accent })
  }, [active, ratio, time, label, progress, accent])

  useEffect(() => {
    if (!active || !('mediaSession' in navigator)) return
    const session = navigator.mediaSession
    session.setActionHandler('play', onPlay)
    session.setActionHandler('pause', onPause)
    session.playbackState = running ? 'playing' : 'paused'
    return () => {
      session.setActionHandler('play', null)
      session.setActionHandler('pause', null)
      session.playbackState = 'none'
    }
  }, [active, running, onPlay, onPause])

  async function toggle() {
    const video = videoRef.current
    if (!video) return
    try {
      if (document.pictureInPictureElement === video) {
        await document.exitPictureInPicture()
        return
      }
      if (!canvasRef.current) {
        const canvas = document.createElement('canvas')
        canvas.width = WIDTH
        canvasRef.current = canvas
        video.srcObject = canvas.captureStream()
      }
      setRatio(COMPACT_RATIO)
      canvasRef.current.height = Math.round(WIDTH / COMPACT_RATIO)
      draw(canvasRef.current, frame)
      await video.play()
      await metadataLoaded(video)
      const pipWindow = await video.requestPictureInPicture()
      const fitWindow = () => {
        if (pipWindow.width && pipWindow.height) setRatio(pipWindow.width / pipWindow.height)
      }
      fitWindow()
      pipWindow.addEventListener('resize', fitWindow)
    } catch {
      onError()
    }
  }

  return { videoRef, active, toggle }
}
