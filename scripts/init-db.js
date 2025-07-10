import mysql from 'mysql2/promise';
import 'dotenv/config';

async function initDatabase() {
  // Crear conexión sin especificar la base de datos primero
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    multipleStatements: true
  });

  try {
    console.log('Conectado al servidor MySQL');
    
    // Crear la base de datos si no existe
    await connection.query('CREATE DATABASE IF NOT EXISTS papeleria');
    console.log('Base de datos "papeleria" verificada/creada');
    
    // Usar la base de datos
    await connection.query('USE papeleria');
    
    // Eliminar la tabla si existe para recrearla
    await connection.query('DROP TABLE IF EXISTS productos');
    
    // Crear la tabla productos con la estructura correcta
    await connection.query(`
      CREATE TABLE productos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        descripcion TEXT,
        precio DECIMAL(10, 2) NOT NULL,
        imagen_url VARCHAR(512),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    
    console.log('Tabla "productos" creada exitosamente');
    
    // Insertar datos de ejemplo
    try {
      await connection.query(`
        INSERT INTO productos (nombre, descripcion, precio, imagen_url) VALUES
          ('Cuaderno profesional', 'Cuaderno profesional de 100 hojas', 125.50, 'https://example.com/cuaderno.jpg'),
          ('Lápiz HB', 'Paquete con 12 lápices HB', 45.99, 'https://example.com/lapiz.jpg'),
          ('Bolígrafo azul', 'Bolígrafo de tinta azul punta media', 15.75, 'https://example.com/boligrafo.jpg');
      `);
      console.log('Datos de ejemplo insertados correctamente');
    } catch (insertError) {
      console.error('Error al insertar datos de ejemplo:', insertError);
    }
    
    console.log('Base de datos inicializada correctamente');
    
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
  } finally {
    await connection.end();
    console.log('Conexión cerrada');
  }
}

initDatabase().catch(console.error);
