import { query } from '../../lib/query';



// Manejar solicitudes GET para obtener todos los productos o uno específico por ID
export async function GET({ url }) {
  try {
    const id = url.searchParams.get('id');
    
    if (id) {
      // Si se proporciona un ID, devolver solo ese producto
      const [producto] = await query('SELECT * FROM productos WHERE id = ?', [id]);
      
      if (!producto) {
        return new Response(
          JSON.stringify({ error: 'Producto no encontrado' }), 
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(JSON.stringify(producto), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, max-age=0'
        }
      });
    }
    
    // Si no hay ID, devolver todos los productos
    const productos = await query('SELECT * FROM productos');
    return new Response(JSON.stringify(productos), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0'
      }
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return new Response(JSON.stringify({ 
      error: 'Error al obtener los productos',
      details: error.message 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Manejar solicitudes POST para crear un nuevo producto
export async function POST({ request }) {
  try {
    const data = await request.json();
    
    // Validar datos de entrada
    if (!data.nombre || !data.precio) {
      return new Response(JSON.stringify({ 
        error: 'Nombre y precio son campos requeridos' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Insertar el nuevo producto en la base de datos
    const result = await query(
      'INSERT INTO productos (nombre, descripcion, precio, imagen_url) VALUES (?, ?, ?, ?)',
      [data.nombre, data.descripcion || null, data.precio, data.imagen_url || null]
    );

    // Obtener el ID del producto insertado
    const [producto] = await query('SELECT * FROM productos WHERE id = ?', [result.insertId]);

    return new Response(JSON.stringify(producto), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error al crear el producto:', error);
    return new Response(JSON.stringify({ 
      error: 'Error al crear el producto',
      details: error.message 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}