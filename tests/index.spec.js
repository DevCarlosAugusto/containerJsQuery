import { containerJsQuery } from '../src/index.js'

describe('containerJsQuery Library', () => {
  let element
  let observerCallback

  beforeEach(() => {
    element = document.createElement('div')

    // Mock do ResizeObserver para o Vitest
    global.ResizeObserver = class {
      constructor(cb) { observerCallback = cb }
      observe() {}
      disconnect() {}
    }
  })

  it('deve aplicar atributos baseados na largura', async () => {
    const breakpoints = { md: 500 }
    containerJsQuery(element, breakpoints)

    // Simula a mudança de tamanho
    observerCallback([{ contentRect: { width: 600 }, target: element }])

    // No Vitest/Vite, aguardamos o próximo tick para garantir que o rAF executou
    await new Promise(res => setTimeout(res, 0))

    expect(element.hasAttribute('data-container-md')).toBe(true)
  })
})
