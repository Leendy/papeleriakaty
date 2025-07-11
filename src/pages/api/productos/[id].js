import { query } from '../../../lib/query';

// Manejar solicitudes GET para obtener un producto por ID
export async function GET({ params }) {
  try {
    const { id } = params;
    
    if (!id) {
      return new Response(
        JSON.stringify({ error: 'Se requiere el ID del producto' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const [producto] = await query('SELECT * FROM productos WHERE id = ?', [id]);
    
    if (!producto) {
      return new Response(
        JSON.stringify({ error: 'Producto no encontrado' }), 
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify(producto), 
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Error al obtener el producto',
        details: error.message 
      }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Manejar solicitudes PUT para actualizar un producto
export async function PUT({ params, request }) {
  try {
    const { id } = params;
    
    if (!id) {
      return new Response(
        JSON.stringify({ error: 'Se requiere el ID del producto' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Obtener los datos del cuerpo de la solicitud
    const data = await request.json();
    
    // Validar datos requeridos
    if (!data.nombre || !data.precio) {
      return new Response(
        JSON.stringify({ error: 'Nombre y precio son campos requeridos' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verificar si el producto existe
    const [productoExistente] = await query('SELECT id FROM productos WHERE id = ?', [id]);
    
    if (!productoExistente) {
      return new Response(
        JSON.stringify({ error: 'Producto no encontrado' }), 
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Actualizar el producto
    await query(
      'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, imagen_url = ? WHERE id = ?',
      [data.nombre, data.descripcion || null, data.precio, data.imagen_url || null, id]
    );
    
    // Obtener el producto actualizado
    const [productoActualizado] = await query('SELECT * FROM productos WHERE id = ?', [id]);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Producto actualizado correctamente',
        producto: productoActualizado 
      }), 
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Error al actualizar el producto',
        details: error.message 
      }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Manejar solicitudes DELETE para eliminar un producto
export async function DELETE({ params }) {
  try {
    const { id } = params;
    
    if (!id) {
      return new Response(
        JSON.stringify({ error: 'Se requiere el ID del producto' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verificar si el producto existe
    const [producto] = await query('SELECT id FROM productos WHERE id = ?', [id]);
    
    if (!producto) {
      return new Response(
        JSON.stringify({ error: 'Producto no encontrado' }), 
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Eliminar el producto
    await query('DELETE FROM productos WHERE id = ?', [id]);
    
    return new Response(
      JSON.stringify({ success: true, message: 'Producto eliminado correctamente' }), 
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Error al eliminar el producto',
        details: error.message 
      }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
