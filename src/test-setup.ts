import '@testing-library/jest-dom/vitest'

// Thorough canvas mock for ECharts in jsdom
const noop = () => {}
const noopReturns = (v: any) => () => v

Object.defineProperties(HTMLCanvasElement.prototype, {
  width: { get() { return this._width || 800 }, set(v: number) { this._width = v } },
  height: { get() { return this._height || 600 }, set(v: number) { this._height = v } },
})

HTMLCanvasElement.prototype.getContext = (() => {
  const ctx: any = {
    // State
    save: noop,
    restore: noop,
    scale: noop,
    rotate: noop,
    translate: noop,
    transform: noop,
    setTransform: noop,
    resetTransform: noop,
    // Paths
    beginPath: noop,
    closePath: noop,
    moveTo: noop,
    lineTo: noop,
    bezierCurveTo: noop,
    quadraticCurveTo: noop,
    arc: noop,
    arcTo: noop,
    rect: noop,
    // Styles
    strokeStyle: '#000',
    fillStyle: '#000',
    lineWidth: 1,
    lineCap: 'butt',
    lineJoin: 'miter',
    miterLimit: 10,
    globalAlpha: 1,
    globalCompositeOperation: 'source-over',
    // Methods
    stroke: noop,
    fill: noop,
    clip: noop,
    fillRect: noop,
    strokeRect: noop,
    clearRect: noop,
    // Text
    font: '10px sans-serif',
    textAlign: 'start',
    textBaseline: 'alphabetic',
    fillText: noop,
    strokeText: noop,
    measureText: () => ({ width: 0 }),
    // Images
    drawImage: noop,
    createImageData: () => ({ data: new Uint8ClampedArray(0), width: 0, height: 0 }),
    getImageData: () => ({ data: new Uint8ClampedArray(0), width: 0, height: 0 }),
    putImageData: noop,
    // Gradients / patterns
    createLinearGradient: noopReturns({}),
    createRadialGradient: noopReturns({}),
    createPattern: noopReturns({}),
    // Lines
    setLineDash: noop,
    getLineDash: () => [],
    lineDashOffset: 0,
    // Misc
    getContextAttributes: noopReturns({}),
    canvas: {
      width: 800,
      height: 600,
      getBoundingClientRect: () => ({ width: 800, height: 600, top: 0, left: 0, right: 800, bottom: 600 }),
    },
  }
  return () => ctx as any
})() as any


//
