// Extend the global Window interface
interface Producto {
  id: number;
  nombre: string;
  descripcion?: string;
  categoria?: string;
  precio: number;
  stock: number;
  imagen_url?: string;
}

interface EstadoProductos {
  productos: Producto[];
  error: string | null;
  cargando: boolean;
}

declare global {
  interface Window {
    productosState: EstadoProductos;
    recargarProductos?: () => void;
  }
}

export {}; // This file needs to be a module
