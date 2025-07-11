// Función para cargar los productos desde la API
async function cargarProductos() {
  try {
    // Mostrar mensaje de carga
    const tbody = document.querySelector('tbody');
    if (tbody) {
      tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-4 text-center">Cargando productos...</td></tr>';
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
              <td colspan="5" class="px-6 py-4 text-center">
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
            <td colspan="5" class="px-6 py-4 text-center">
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
          <td colspan="5" class="px-6 py-4 text-center">
            <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
              <p class="font-bold">Error de conexión</p>
              <p>No se pudo conectar con el servidor. Verifique su conexión a Internet.</p>
            </div>
          </td>
        </tr>`;
    }
  }
}

// Función para mostrar un mensaje de confirmación personalizado
function confirmarEliminacion(id) {
  if (window.confirm('¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.')) {
    eliminarProducto(id);
  }
}

// Función para eliminar un producto
async function eliminarProducto(id) {
  try {
    console.log('Iniciando eliminación del producto con ID:', id);
    
    // Usar la ruta correcta para la API
    const url = new URL(`/api/productos/${id}`, window.location.origin);
    console.log('URL de la solicitud:', url.toString());
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin'  // Asegura que se envíen las cookies
    });

    // Verificar si la respuesta es exitosa
    if (response.ok) {
      const result = await response.json();
      console.log('Producto eliminado correctamente:', result);
      window.alert('Producto eliminado correctamente');
      // Recargar la página para ver los cambios
      window.location.reload();
    } else {
      // Manejar errores de la API
      let errorMessage = 'Error al eliminar el producto';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
        if (errorData.details) {
          errorMessage += `: ${errorData.details}`;
        }
      } catch (e) {
        // Si no se puede parsear el error como JSON
        errorMessage = `Error ${response.status}: ${response.statusText}`;
      }
      console.error('Error al eliminar el producto:', errorMessage);
      window.alert(errorMessage);
    }
  } catch (error) {
    console.error('Error en la solicitud de eliminación:', error);
    window.alert('Error al conectar con el servidor. Por favor, verifica tu conexión e inténtalo de nuevo.');
  }
}

// Función para editar un producto
function editarProducto(id) {
  // Redirigir a la página de edición con el ID del producto
  window.location.href = `/admin/editar-producto/${id}`;
}

// Función para renderizar los productos en la tabla
function renderizarProductos(productos) {
  const tbody = document.querySelector('tbody');
  if (!tbody) return;

  // Limpiar la tabla
  tbody.innerHTML = '';

  // Agregar cada producto a la tabla
  productos.forEach(producto => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-gray-50';
    tr.innerHTML = `
      <td class="px-6 py-4 whitespace-nowrap">
        ${producto.imagen_url ? 
          `<img src="${producto.imagen_url}" alt="${producto.nombre}" class="h-16 w-16 object-cover rounded" onerror="this.onerror=null;this.src='https://via.placeholder.com/64'" />` : 
          `<div class="h-16 w-16 bg-gray-200 rounded flex items-center justify-center">
            <span class="text-gray-400 text-xs">Sin imagen</span>
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
        <div class="text-sm font-medium text-gray-900">$${Number(producto.precio).toFixed(2)}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button 
          data-action="editar"
          data-id="${producto.id}"
          class="btn-editar text-indigo-600 hover:text-indigo-900 mr-4"
          title="Editar producto">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span class="sr-only">Editar</span>
        </button>
        <button 
          data-action="eliminar"
          data-id="${producto.id}"
          class="btn-eliminar text-red-600 hover:text-red-900"
          title="Eliminar producto">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span class="sr-only">Eliminar</span>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Asignar manejadores de eventos después de que el DOM se cargue
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM cargado, configurando manejadores de eventos...');
  
  // Cargar los productos al iniciar
  cargarProductos();
  
  // Manejador de eventos delegado para todos los botones de acción
  document.addEventListener('click', function(event) {
    // Encontrar el botón más cercano al elemento clickeado que tenga el atributo data-action
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    
    const action = button.getAttribute('data-action');
    const id = button.getAttribute('data-id');
    
    console.log('Botón clickeado:', { action, id });
    
    if (!id) {
      console.error('No se encontró el ID del producto');
      return;
    }
    
    const productId = parseInt(id, 10);
    
    if (action === 'eliminar') {
      event.preventDefault();
      event.stopPropagation();
      confirmarEliminacion(productId);
    } else if (action === 'editar') {
      event.preventDefault();
      event.stopPropagation();
      editarProducto(productId);
    }
  });
});
