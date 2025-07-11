import bcrypt from 'bcryptjs';
import pool from '../src/lib/db.js';

async function createTestUser() {
  try {
    const email = 'admin@papeleriakaty.com';
    const password = 'admin123';
    const nombre_usuario = 'Admin';
    const rol = 'admin';
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    
    // First, try to update the user if they exist
    const [updateResult] = await pool.query(
      'UPDATE usuarios SET email = ?, password_hash = ?, rol = ? WHERE nombre_usuario = ?',
      [email, password_hash, rol, nombre_usuario]
    );
    
    // If no rows were updated, insert a new user
    if (updateResult.affectedRows === 0) {
      console.log('No existing user found, creating new admin user...');
      try {
        await pool.query(
          'INSERT INTO usuarios (nombre_usuario, email, password_hash, rol) VALUES (?, ?, ?, ?)',
          [nombre_usuario, email, password_hash, rol]
        );
      } catch (insertError) {
        // If insert fails due to duplicate email, update by email instead
        if (insertError.code === 'ER_DUP_ENTRY' && insertError.sqlMessage.includes('email')) {
          console.log('User with this email already exists, updating...');
          await pool.query(
            'UPDATE usuarios SET nombre_usuario = ?, password_hash = ?, rol = ? WHERE email = ?',
            [nombre_usuario, password_hash, rol, email]
          );
        } else {
          throw insertError;
        }
      }
    } else {
      console.log('Existing user updated successfully');
    }
    
    console.log('Admin user created/updated successfully!');
    console.log('Email: admin@papeleriakaty.com');
    console.log('Password: admin123');
    
  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    // Close the database connection
    await pool.end();
    process.exit();
  }
}

createTestUser();
