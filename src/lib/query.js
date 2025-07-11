import pool from './db';

export async function query(sql, params = []) {
  let connection;
  try {
    // Obtener una conexión del pool
    connection = await pool.getConnection();
    console.log('Conexión a la base de datos establecida');
    
    // Ejecutar la consulta
    console.log('Ejecutando consulta:', sql);
    console.log('Parámetros:', params);
    
    const [rows] = await connection.execute(sql, params);
    console.log('Consulta ejecutada correctamente. Resultado:', JSON.stringify(rows, null, 2));
    
    // Para consultas de inserción, retornar el resultado completo
    if (sql.trim().toUpperCase().startsWith('INSERT')) {
      return { insertId: rows.insertId };
    }
    
    // Para SELECT, devolver los resultados directamente
    if (Array.isArray(rows)) {
      return rows;
    }
    
    // Para otros tipos de consultas (UPDATE, DELETE, etc.) devolver el resultado
    return rows || [];
  } catch (error) {
    console.error('Error en la consulta SQL:', {
      message: error.message,
      code: error.code,
      errno: error.errno,
      sql: error.sql,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
    
    // Lanzar un error más descriptivo
    throw new Error(`Error en la consulta: ${error.message}`, { cause: error });
  } finally {
    // Liberar la conexión de vuelta al pool
    if (connection) {
      console.log('Liberando conexión al pool');
      connection.release();
    }
  }
}