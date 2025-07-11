import pool from '../src/lib/db.js';

async function showTables() {
  let connection;
  try {
    connection = await pool.getConnection();
    
    // Get list of all tables
    const [tables] = await connection.query("SHOW TABLES");
    console.log('\n=== Tablas en la base de datos ===');
    
    // For each table, show its structure and first 5 rows
    for (const tableInfo of tables) {
      const tableName = tableInfo[`Tables_in_${pool.config.connectionConfig.database}`];
      
      // Show table structure
      console.log(`\n=== Estructura de la tabla: ${tableName} ===`);
      const [columns] = await connection.query(`DESCRIBE ${tableName}`);
      console.table(columns);
      
      // Show first 5 rows
      console.log(`\n=== Primeras 5 filas de ${tableName} ===`);
      const [rows] = await connection.query(`SELECT * FROM ${tableName} LIMIT 5`);
      
      if (rows.length > 0) {
        console.table(rows);
      } else {
        console.log('La tabla está vacía');
      }
      
      console.log('\n' + '='.repeat(50));
    }
    
  } catch (error) {
    console.error('Error al mostrar las tablas:', error);
  } finally {
    if (connection) connection.release();
    // Close the connection pool
    await pool.end();
    process.exit();
  }
}

showTables();
