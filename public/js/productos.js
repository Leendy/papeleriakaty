console.log('productos.js cargado correctamente');

// Función para cargar los productos desde la API
async function cargarProductos() {
  try {
    // Mostrar mensaje de carga
    const tbody = document.querySelector('tbody');
    if (tbody) {
      tbody.innerHTML = '<tr><td colspan="4" class="px-6 py-4 text-center">Cargando productos...</td></tr>';
    }
    
    const response = await fetch('/api/productos');
    if (response.ok) {
      const productos = await response.json();
      console.log('Productos cargados:', productos);
      
      if (productos.length === 0) {
        // Mostrar mensaje si no hay productos
        if (tbody) {
          tbody.innerHTML = `
            <tr>
              <td colspan="4" class="px-6 py-4 text-center">
                <div class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
                  <p class="font-bold">No hay productos disponibles</p>
                  <p>Por favor, intente nuevamente más tarde.</p>
                </div>
              </td>
            </tr>`;
        }
      } else {
        // Renderizar los productos
        renderizarProductos(productos);
      }
    } else {
      console.error('Error al cargar productos:', response.status);
      if (tbody) {
        tbody.innerHTML = `
          <tr>
            <td colspan="4" class="px-6 py-4 text-center">
              <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
                <p class="font-bold">Error al cargar los productos</p>
                <p>Por favor, intente nuevamente más tarde.</p>
              </div>
            </td>
          </tr>`;
      }
    }
  } catch (error) {
    console.error('Error al conectar con la API:', error);
    const tbody = document.querySelector('tbody');
    if (tbody) {
      tbody.innerHTML = `
        <tr>
          <td colspan="4" class="px-6 py-4 text-center">
            <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
              <p class="font-bold">Error de conexión</p>
              <p>No se pudo conectar con el servidor. Verifique su conexión a Internet.</p>
            </div>
          </td>
        </tr>`;
    }
  }
}

// Función para renderizar los productos en la tabla
function renderizarProductos(productos) {
  const tbody = document.querySelector('tbody');
  if (!tbody) return;

  // Limpiar el contenido actual
  tbody.innerHTML = '';

  // Si no hay productos, mostrar mensaje
  if (productos.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" class="px-6 py-4 text-center">No se encontraron productos</td>
      </tr>`;
    return;
  }

  // Renderizar cada producto
  productos.forEach(producto => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-gray-50';
    tr.innerHTML = `
      <td class="px-6 py-4 whitespace-nowrap">
        ${producto.imagen_url ? 
          `<img src="${producto.imagen_url}" alt="${producto.nombre}" class="h-10 w-10 rounded-full object-cover">` : 
          `<div class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
            <span class="text-gray-500">${producto.nombre.charAt(0)}</span>
          </div>`
        }
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm font-medium text-gray-900">${producto.nombre}</div>
      </td>
      <td class="px-6 py-4">
        <div class="text-sm text-gray-500">${producto.descripcion || 'Sin descripción'}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-900">$${parseFloat(producto.precio).toFixed(2)}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
          ${producto.categoria || 'Sin categoría'}
        </span>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  console.log('Cargando productos...');
  // Cargar los productos al iniciar
  cargarProductos();
});
