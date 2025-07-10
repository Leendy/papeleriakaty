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
    
    const [rows, fields] = await connection.execute(sql, params);
    console.log('Consulta ejecutada correctamente');
    
    // Para consultas de inserción, retornar el resultado completo
    if (sql.trim().toUpperCase().startsWith('INSERT')) {
      return { insertId: rows.insertId };
    }
    
    // Asegurarse de devolver un array para consultas SELECT
    return Array.isArray(rows) ? rows : [];
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