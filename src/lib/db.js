import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'papeleria',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  debug: process.env.NODE_ENV === 'development',
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000
};

console.log('Configurando conexión a la base de datos con la configuración:', {
  ...dbConfig,
  password: '***' // No mostrar la contraseña en los logs
});

const pool = mysql.createPool(dbConfig);

// Probar la conexión
async function testConnection() {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log('✅ Conexión a la base de datos exitosa');
    
    // Verificar si la tabla productos existe
    const [tables] = await conn.query("SHOW TABLES LIKE 'productos'");
    if (tables.length === 0) {
      console.error('❌ La tabla productos NO existe');
    } else {
      console.log('✅ Tabla productos encontrada');
    }
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', {
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState
    });
  } finally {
    if (conn) conn.release();
  }
}

// Ejecutar la prueba de conexión
testConnection().catch(console.error);

export default pool;