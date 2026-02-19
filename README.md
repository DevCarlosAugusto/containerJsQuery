# container-media-observer 🚀

Uma biblioteca leve, performática e agnóstica para simular **CSS Container Queries** em qualquer ambiente JavaScript.

Diferente das Media Queries tradicionais que dependem da largura da tela (viewport), esta biblioteca permite que seus componentes reajam ao tamanho do seu **próprio container**, garantindo modularidade real ao seu Design System.

![NPM Version](https://img.shields.io/npm/v/container-media-observer?color=cb3837&style=flat-square)
![NPM Downloads](https://img.shields.io/npm/dm/container-media-observer?style=flat-square)
![License](https://img.shields.io/github/license/DevCarlosAugusto/container-media-polyfill?style=flat-square)
![Build Status](https://img.shields.io/github/actions/workflow/status/DevCarlosAugusto/container-media-polyfill/main.yml?branch=main&style=flat-square)

---

## ✨ Destaques

- ⚡ **Alta Performance**: Utiliza `ResizeObserver` aliado ao `requestAnimationFrame` para evitar gargalos de renderização.
- 🛠 **Estratégias Flexíveis**: Escolha entre aplicar **Atributos de Dados** (padrão CSS) ou **Classes CSS**.
- 🧩 **Escopável**: Evite conflitos entre componentes distintos (ex: `.Button--md` vs `.Box--md`) usando prefixos customizados.
- 📦 **Agnóstico**: Integração perfeita com qualquer framework moderno.

---

## 📦 Instalação

```bash
npm install container-media-observer
```

---

## 📖 Conceito e Tipagem (JSDoc)

A biblioteca fornece IntelliSense completo. Ao utilizar a função, seu editor de código exibirá automaticamente os tipos e descrições dos parâmetros:

```js
/**
 * @param {HTMLElement} element - O elemento DOM a ser monitorado.
 * @param {Object.<string, number>} breakpoints - Ex: { sm: 300, md: 600 }
 * @param {Object} [options] - Configurações opcionais.
 * @param {string} [options.prefix='container-'] - Prefixo para a classe ou atributo.
 * @param {'class'|'attribute'} [options.strategy='attribute'] - Onde aplicar a marcação.
 * @returns {() => void} Função de limpeza (cleanup) para desconectar o observer.
 */
```

## 🛠 Exemplos por Framework

### VueJs

Utilize `ref` para capturar o elemento e os hooks de ciclo de vida para gerenciar o observador.

```vue
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { containerJsQuery } from 'container-media-observer';

const containerRef = ref(null);
let stopQuery;

onMounted(() => {
  // Aplicando estratégia de CLASSE para um Drawer
  stopQuery = containerJsQuery(
    containerRef.value,
    {
      sm: 300,
      md: 700,
    },
    { strategy: 'class', prefix: 'Drawer--' }
  );
});

onBeforeUnmount(() => stopQuery?.());
</script>

<template>
  <div ref="containerRef" class="drawer-container">
    <slot />
  </div>
</template>

<style scoped>
/* A classe será aplicada conforme o tamanho do container: .Drawer--sm ou .Drawer--md */
.Drawer--md {
  display: flex;
  padding: 2rem;
}
</style>
```

### Svelte

Em Svelte, a forma mais eficiente é utilizar uma Action, que lida automaticamente com a criação e destruição do componente.

```html
<script>
  import { containerJsQuery } from 'container-media-observer';

  function containerAction(node) {
    const stop = containerJsQuery(
      node,
      {
        mobile: 320,
        tablet: 768,
      },
      { strategy: 'class', prefix: 'widget-' }
    );

    return {
      destroy() {
        stop();
      },
    };
  }
</script>

<div use:containerAction class="my-widget">
  O estilo desta div muda conforme o tamanho dela mesma.
</div>

<style>
  :global(.widget-mobile) {
    font-size: 0.8rem;
  }
  :global(.widget-tablet) {
    font-size: 1.2rem;
  }
</style>
```

### React

Combine `useRef` e `useEffect` para inicializar a biblioteca e garantir que o cleanup seja executado ao desmontar.

```jsx
import { useEffect, useRef } from 'react';
import { containerJsQuery } from 'container-media-observer';

export const Box = ({ children }) => {
  const boxRef = useRef(null);

  useEffect(() => {
    const cleanup = containerJsQuery(
      boxRef.current,
      {
        wide: 500,
      },
      { strategy: 'class', prefix: 'Box--' }
    );

    return () => cleanup();
  }, []);

  return (
    <div ref={boxRef} className="box-component">
      {children}
    </div>
  );
};
```

### Angular

Acesse o DOM através de `@ViewChild` e utilize os hooks `AfterViewInit` e `OnDestroy`.

```ts
import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { containerJsQuery } from 'container-media-observer';

@Component({
  selector: 'app-card',
  template: `<div #cardElement class="card-container">...</div>`,
})
export class CardComponent implements AfterViewInit, OnDestroy {
  @ViewChild('cardElement') cardElement!: ElementRef;
  private stop?: () => void;

  ngAfterViewInit() {
    this.stop = containerJsQuery(
      this.cardElement.nativeElement,
      {
        full: 800,
      },
      { strategy: 'attribute', prefix: 'card-' }
    );
  }

  ngOnDestroy() {
    this.stop?.();
  }
}
```

### Lit

Em componentes Lit (Web Components), o método `firstUpdated` é o local correto para iniciar observadores de DOM.

```js
import { LitElement, html } from 'lit';
import { query } from 'lit/decorators.js';
import { containerJsQuery } from 'container-media-observer';

class MyButton extends LitElement {
  @query('.btn-wrapper') _btn;

  firstUpdated() {
    this._cleanup = containerJsQuery(
      this._btn,
      {
        large: 400,
      },
      { strategy: 'class', prefix: 'btn-' }
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._cleanup?.();
  }

  render() {
    return html`<div class="btn-wrapper"><button>Click Me</button></div>`;
  }
}
customElements.define('my-button', MyButton);
```

## 🎨 Exemplos de CSS

##### Usando Atributos (Padrão)

Ideal para manter uma estrutura baseada em dados:

```css
.card[data-container-md] {
  grid-template-columns: 1fr 1fr;
}
```

#### Usando Classes (Estratégia de Escopo)

Ideal para Design Systems onde cada componente tem seu próprio namespace:

```css
/* Botão reage apenas se o container dele for 'sm' */
.Button--sm {
  padding: 4px;
  font-size: 10px;
}

/* Box reage apenas se o container dela for 'lg' */
.Box--lg {
  padding: 40px;
  border-radius: 20px;
}
```
