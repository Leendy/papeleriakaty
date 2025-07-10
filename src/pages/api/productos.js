import { query } from '../../lib/query';

// Función para manejar respuestas de error
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, max-age=0'
    }
  });
}

export async function GET() {
  try {
    const productos = await query('SELECT * FROM productos');
    return jsonResponse(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return jsonResponse({ 
      error: 'Error al obtener productos',
      details: error.message 
    }, 500);
  }
}

// Función para verificar la conexión a la base de datos
async function checkDatabaseConnection() {
  try {
    await query('SELECT 1');
    return { connected: true };
  } catch (error) {
    console.error('Error de conexión a la base de datos:', error);
    return { 
      connected: false, 
      error: error.message,
      code: error.code
    };
  }
}

export async function POST({ request }) {
  try {
    // Obtener los datos del cuerpo de la petición
    let data;
    const contentType = request.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      // Si es JSON, parsear el cuerpo
      data = await request.json();
    } else if (contentType && contentType.includes('multipart/form-data')) {
      // Si es form-data, procesar como antes
      const formData = await request.formData();
      data = Object.fromEntries(formData.entries());
    } else {
      return jsonResponse({
        success: false,
        error: 'Content-Type no soportado. Use application/json o multipart/form-data'
      }, 400);
    }
    
    console.log('Datos recibidos:', data);
    
    // Validar datos requeridos
    if (!data.nombre || !data.precio) {
      return jsonResponse({ 
        success: false,
        error: 'Nombre y precio son campos requeridos',
        receivedData: data
      }, 400);
    }
    
    // Validar que el precio sea un número
    const precio = parseFloat(data.precio);
    if (isNaN(precio)) {
      return jsonResponse({
        success: false,
        error: 'El precio debe ser un número válido',
        receivedPrecio: data.precio
      }, 400);
    }
    
    // Insertar en la base de datos
    try {
      const result = await query(
        'INSERT INTO productos (nombre, descripcion, precio, imagen_url) VALUES (?, ?, ?, ?)',
        [
          data.nombre,
          data.descripcion || null,
          precio,
          data.imagen_url || null
        ]
      );
      
      console.log('Resultado de la inserción:', result);
      
      return jsonResponse({
        success: true,
        id: result.insertId,
        message: 'Producto agregado correctamente'
      }, 201);
      
    } catch (dbError) {
      console.error('Error en la base de datos:', {
        message: dbError.message,
        code: dbError.code,
        sql: dbError.sql,
        sqlMessage: dbError.sqlMessage
      });
      
      return jsonResponse({
        success: false,
        error: 'Error al guardar en la base de datos',
        details: dbError.message
      }, 500);
    }
    
  } catch (error) {
    console.error('Error en el servidor:', error);
    return jsonResponse({
      success: false,
      error: 'Error interno del servidor',
      details: error.message
    }, 500);
  }
}
