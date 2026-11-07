/** Ambient sea + wind synthesised with the Web Audio API. Never starts without a user click. */
let ctx: AudioContext | null = null
let master: GainNode | null = null

function noiseBuffer(c: AudioContext, seconds = 4) {
  const len = c.sampleRate * seconds
  const buf = c.createBuffer(2, len, c.sampleRate)
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch)
    let last = 0
    for (let i = 0; i < len; i++) {
      const white = Math.random() * 2 - 1
      last = (last + 0.02 * white) / 1.02 // brown noise
      d[i] = last * 3.2
    }
  }
  return buf
}

function build(c: AudioContext) {
  master = c.createGain()
  master.gain.value = 0
  master.connect(c.destination)

  // Sea: brown noise through a lowpass whose gain swells like waves
  const sea = c.createBufferSource()
  sea.buffer = noiseBuffer(c)
  sea.loop = true
  const lp = c.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 520
  const swell = c.createGain()
  swell.gain.value = 0.55
  const lfo = c.createOscillator()
  lfo.frequency.value = 0.11
  const lfoGain = c.createGain()
  lfoGain.gain.value = 0.4
  lfo.connect(lfoGain).connect(swell.gain)
  sea.connect(lp).connect(swell).connect(master)

  // Wind: higher band, slowly wandering
  const wind = c.createBufferSource()
  wind.buffer = noiseBuffer(c, 3)
  wind.loop = true
  const bp = c.createBiquadFilter()
  bp.type = 'bandpass'
  bp.frequency.value = 900
  bp.Q.value = 0.7
  const wg = c.createGain()
  wg.gain.value = 0.08
  const lfo2 = c.createOscillator()
  lfo2.frequency.value = 0.05
  const lfo2g = c.createGain()
  lfo2g.gain.value = 400
  lfo2.connect(lfo2g).connect(bp.frequency)
  wind.connect(bp).connect(wg).connect(master)

  sea.start(); wind.start(); lfo.start(); lfo2.start()
}

export async function setAmbient(on: boolean) {
  if (on) {
    if (!ctx) {
      const AC = window.AudioContext || (window as any).webkitAudioContext
      ctx = new AC()
      build(ctx)
    }
    await ctx.resume()
    master!.gain.cancelScheduledValues(ctx.currentTime)
    master!.gain.setTargetAtTime(0.18, ctx.currentTime, 0.8)
  } else if (ctx && master) {
    master.gain.cancelScheduledValues(ctx.currentTime)
    master.gain.setTargetAtTime(0, ctx.currentTime, 0.3)
    setTimeout(() => ctx?.state === 'running' && master!.gain.value < 0.01 && ctx.suspend(), 1500)
  }
}
