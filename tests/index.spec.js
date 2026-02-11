import { containerJsQuery } from '../src/index.js'
import { vi, describe, it, expect, beforeEach } from 'vitest'

describe('containerJsQuery Library', () => {
  let element
  let observerCallback

  beforeEach(() => {
    element = document.createElement('div')

    vi.stubGlobal('requestAnimationFrame', (cb) => cb())

    global.ResizeObserver = class {
      constructor(cb) { observerCallback = cb }
      observe() {}
      disconnect() {}
    }
  })

  it('deve aplicar classes específicas quando a estratégia for "class"', () => {
    containerJsQuery(element, { md: 500 }, { strategy: 'class', prefix: 'Button--' })
    observerCallback([{ contentRect: { width: 600 }, target: element }])
    expect(element.classList.contains('Button--md')).toBe(true)
  })

  it('deve manter o comportamento de atributo por padrão', () => {
    containerJsQuery(element, { md: 500 })
    observerCallback([{ contentRect: { width: 600 }, target: element }])
    expect(element.hasAttribute('data-container-md')).toBe(true)
  })
})
