import mysql from 'mysql2/promise';

async function checkDatabase() {
  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'papeleria'
  });

  try {
    // List all tables
    const [tables] = await connection.query('SHOW TABLES');
    console.log('\n=== Tablas en la base de datos ===');
    console.table(tables);

    // For each table, show structure and data
    for (const table of tables) {
      const tableName = table[`Tables_in_papeleria`];
      
      console.log(`\n=== Estructura de la tabla: ${tableName} ===`);
      const [columns] = await connection.query(`DESCRIBE ${tableName}`);
      console.table(columns);
      
      console.log(`\n=== Datos en ${tableName} ===`);
      const [rows] = await connection.query(`SELECT * FROM ${tableName} LIMIT 5`);
      if (rows.length > 0) {
        console.table(rows);
      } else {
        console.log('La tabla está vacía');
      }
    }
  } catch (error) {
    console.error('Error al verificar la base de datos:', error);
  } finally {
    await connection.end();
  }
}

checkDatabase();
