/**
 * Definição dos breakpoints de container.
 * @typedef {Object.<string, number>} Breakpoints
 */

/**
 * Simula CSS Container Queries aplicando atributos de dados baseados na largura do elemento.
 * * @param {HTMLElement} element - O elemento DOM a ser monitorado.
 * @param {Breakpoints} breakpoints - Objeto com nomes e larguras mínimas (ex: { md: 600 }).
 * @returns {() => void} Função para desconectar o observer (cleanup).
 */
export function containerJsQuery(element, breakpoints) {
  if (!element || typeof window === 'undefined' || !window.ResizeObserver) {
    return () => {};
  }

  const observer = new ResizeObserver((entries) => {
    window.requestAnimationFrame(() => {
      if (!Array.isArray(entries) || !entries.length) return;

      const width = entries[0].contentRect.width;

      Object.entries(breakpoints).forEach(([name, minWidth]) => {
        const attr = `data-container-${name}`;
        if (width >= minWidth) {
          if (!element.hasAttribute(attr)) element.setAttribute(attr, '');
        } else {
          if (element.hasAttribute(attr)) element.removeAttribute(attr);
        }
      });
    });
  });

  observer.observe(element);
  return () => observer.disconnect();
}
