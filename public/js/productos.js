console.log('productos.js cargado correctamente');

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
  return window.confirm('¿Está seguro de que desea eliminar este producto?');
}

// Función para eliminar un producto
async function eliminarProducto(id) {
  if (!confirmarEliminacion(id)) return;

  try {
    const response = await fetch(`/api/productos/${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      // Recargar la lista de productos
      cargarProductos();
      // Mostrar mensaje de éxito
      mostrarNotificacion('El producto se ha eliminado correctamente', 'success');
    } else {
      const errorData = await response.json();
      throw new Error(errorData.error || 'No se pudo eliminar el producto');
    }
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    mostrarNotificacion(
      error.message || 'Ocurrió un error al intentar eliminar el producto. Por favor, inténtelo de nuevo más tarde.',
      'error'
    );
  }
}

// Función para navegar a la página de edición de un producto
function editarProducto(id) {
  try {
    console.log('Iniciando edición del producto ID:', id);
    
    if (!id) {
      throw new Error('No se proporcionó un ID de producto');
    }
    
    // Construir la URL de edición
    const baseUrl = window.location.origin;
    const url = `${baseUrl}/admin/editar-producto/${id}`;
    
    console.log('Redirigiendo a:', url);
    
    // Redirigir a la página de edición
    window.location.href = url;
    
  } catch (error) {
    console.error('Error en editarProducto:', error);
    alert(`Error al intentar editar el producto: ${error.message}`);
  }
}

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje, tipo = 'info') {
  // Aquí puedes implementar un sistema de notificaciones más elegante
  // Por ahora, usaremos alertas simples
  const mensajes = {
    'success': '¡Operación exitosa!',
    'error': 'Error',
    'info': 'Información'
  };
  
  const titulo = mensajes[tipo] || 'Mensaje';
  alert(`${titulo}: ${mensaje}`);
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
          `<img src="${producto.imagen_url}" alt="${producto.nombre}" class="h-16 w-16 object-cover rounded" onerror="this.onerror=null;this.src='https://via.placeholder.com/64';">` : 
          '<div class="h-16 w-16 bg-gray-200 rounded flex items-center justify-center">Sin imagen</div>'
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
          class="text-indigo-600 hover:text-indigo-900 mr-4"
          title="Editar producto">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span class="sr-only">Editar</span>
        </button>
        <button 
          data-action="eliminar"
          data-id="${producto.id}"
          class="text-red-600 hover:text-red-900"
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

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM cargado, configurando manejadores de eventos...');
  
  // Cargar los productos al iniciar
  cargarProductos();
  
  // Manejador de eventos delegado para todos los botones de acción
  document.addEventListener('click', function(event) {
    try {
      // Encontrar el botón más cercano al elemento clickeado que tenga el atributo data-action
      const button = event.target.closest('button[data-action]');
      if (!button) return;
      
      // Prevenir el comportamiento por defecto y la propagación
      event.preventDefault();
      event.stopPropagation();
      
      const action = button.getAttribute('data-action');
      const id = button.getAttribute('data-id');
      
      console.log('Botón clickeado:', { action, id });
      
      // Validar que tengamos un ID
      if (!id) {
        console.error('No se encontró el ID del producto');
        mostrarNotificacion('Error: No se pudo identificar el producto', 'error');
        return;
      }
      
      const productId = parseInt(id, 10);
      
      // Manejar diferentes acciones
      switch (action) {
        case 'eliminar':
          eliminarProducto(productId);
          break;
          
        case 'editar':
          console.log('Iniciando edición del producto ID:', productId);
          editarProducto(productId);
          break;
          
        default:
          console.warn('Acción no reconocida:', action);
      }
      
    } catch (error) {
      console.error('Error en el manejador de eventos:', error);
      mostrarNotificacion(`Error: ${error.message}`, 'error');
    }
  });
});
