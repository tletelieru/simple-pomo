export type AmbienceKind = 'rain' | 'waves' | 'brown'

export interface Ambience {
  setVolume: (volume: number) => void
  stop: () => void
}

function noiseBuffer(ctx: AudioContext, brown: boolean): AudioBuffer {
  const buffer = ctx.createBuffer(2, ctx.sampleRate * 8, ctx.sampleRate)
  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel)
    let last = 0
    for (let i = 0; i < data.length; i++) {
      const white = Math.random() * 2 - 1
      if (brown) {
        last = (last + 0.02 * white) / 1.02
        data[i] = last * 3.5
      } else {
        data[i] = white
      }
    }
  }
  return buffer
}

export function startAmbience(kind: AmbienceKind, volume: number): Ambience {
  const ctx = new AudioContext()
  const source = ctx.createBufferSource()
  source.buffer = noiseBuffer(ctx, kind !== 'rain')
  source.loop = true

  const filter = ctx.createBiquadFilter()
  const master = ctx.createGain()
  master.gain.value = volume
  source.connect(filter)

  if (kind === 'rain') {
    filter.type = 'bandpass'
    filter.frequency.value = 1800
    filter.Q.value = 0.4
    const level = ctx.createGain()
    level.gain.value = 0.25
    filter.connect(level).connect(master)
  } else if (kind === 'waves') {
    filter.type = 'lowpass'
    filter.frequency.value = 900
    const swell = ctx.createGain()
    swell.gain.value = 0.55
    const lfo = ctx.createOscillator()
    lfo.frequency.value = 0.09
    const depth = ctx.createGain()
    depth.gain.value = 0.4
    lfo.connect(depth).connect(swell.gain)
    lfo.start()
    filter.connect(swell).connect(master)
  } else {
    filter.type = 'lowpass'
    filter.frequency.value = 600
    filter.connect(master)
  }

  master.connect(ctx.destination)
  source.start()

  return {
    setVolume: (value) => {
      master.gain.value = value
    },
    stop: () => {
      void ctx.close()
    },
  }
}
