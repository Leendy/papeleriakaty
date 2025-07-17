/// <reference types="astro/client" />

// Extender la interfaz Window para incluir propiedades globales
interface Window {
  // Agregar propiedades globales aquí si es necesario
}

// Extender la interfaz HTMLElement para incluir propiedades personalizadas
interface HTMLElement {
  value?: string;
  checked?: boolean;
  disabled?: boolean;
}

// Declarar tipos para elementos del DOM
interface HTMLInputElement {
  value: string;
  checked: boolean;
  disabled: boolean;
}

interface HTMLElementEventMap {
  submit: Event;
  click: MouseEvent;
  // Agregar más tipos de eventos según sea necesario
}

// Declarar tipos para el objeto document
declare const document: Document & {
  getElementById(elementId: string): HTMLElement | null;
  querySelector(selectors: string): Element | null;
  querySelectorAll(selectors: string): NodeListOf<Element>;
  // Agregar más métodos según sea necesario
};

// Declarar tipos para el objeto window
declare const window: Window & typeof globalThis & {
  location: Location;
  // Agregar más propiedades según sea necesario
};
