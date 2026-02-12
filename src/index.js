/**
 * @typedef {Object.<string, number>} Breakpoints
 */

/**
 * @typedef {Object} QueryOptions
 * @property {string} [prefix='container-'] - Prefixo para a classe ou atributo.
 * @property {'class'|'attribute'} [strategy='attribute'] - Onde aplicar a marcação.
 */

/**
 * Monitora um elemento e aplica classes/atributos baseados em breakpoints.
 * @param {HTMLElement} element - Elemento a ser monitorado.
 * @param {Breakpoints} breakpoints - Definições de tamanhos (ex: { md: 600 }).
 * @param {QueryOptions} [options={}] - Configurações extras.
 * @returns {() => void} Cleanup function.
 */
export function containerJsQuery(element, breakpoints, options = {}) {
  const { prefix = 'container-', strategy = 'attribute' } = options;

  if (!element || typeof window === 'undefined' || !window.ResizeObserver) {
    return () => {};
  }

  const observer = new ResizeObserver((entries) => {
    window.requestAnimationFrame(() => {
      if (!entries.length) return;
      const { width } = entries[0].contentRect;

      Object.entries(breakpoints).forEach(([name, minWidth]) => {
        const marker = `${prefix}${name}`;
        const shouldApply = width >= minWidth;

        if (strategy === 'class') {
          element.classList.toggle(marker, shouldApply);
        } else {
          if (shouldApply) {
            if (!element.hasAttribute(`data-${marker}`))
              element.setAttribute(`data-${marker}`, '');
          } else {
            element.removeAttribute(`data-${marker}`);
          }
        }
      });
    });
  });

  observer.observe(element);
  return () => observer.disconnect();
}
