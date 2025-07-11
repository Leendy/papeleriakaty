import { query } from '../../lib/query';

export async function GET() {
  try {
    // Verificar si la tabla existe
    const [tables] = await query("SHOW TABLES LIKE 'productos'");
    
    if (tables.length === 0) {
      return new Response(JSON.stringify({
        error: 'La tabla productos no existe',
        tables: await query('SHOW TABLES')
      }), { status: 404 });
    }

    // Verificar la estructura de la tabla
    const [columns] = await query('DESCRIBE productos');
    
    // Contar registros
    const [countResult] = await query('SELECT COUNT(*) as count FROM productos');
    const count = countResult[0].count;
    
    // Obtener algunos registros de ejemplo
    const [sampleData] = await query('SELECT * FROM productos LIMIT 5');
    
    return new Response(JSON.stringify({
      tableExists: true,
      columns,
      rowCount: count,
      sampleData
    }, null, 2), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Error al verificar la tabla',
      message: error.message,
      stack: error.stack
    }), { status: 500 });
  }
}
