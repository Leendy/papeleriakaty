import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { JWT_SECRET, ROLES } from './config.js';
import pool from '../db.js';

class AuthService {
  // Iniciar sesión
  static async login(email, password) {
    // Buscar usuario por email
    const [users] = await pool.query(
      'SELECT id, nombre_usuario, email, password_hash, rol FROM usuarios WHERE email = ?',
      [email]
    );
    
    if (users.length === 0) {
      throw new Error('Usuario no encontrado');
    }

    const user = users[0];
    
    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new Error('Contraseña incorrecta');
    }

    // Generar token JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.rol || ROLES.CLIENT, 
        name: user.nombre_usuario 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.nombre_usuario,
        role: user.rol || ROLES.CLIENT
      },
      token
    };
  }

  // Verificar token
  static verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error('Token inválido o expirado');
    }
  }

  // Verificar rol
  static hasRole(user, requiredRoles) {
    if (!user || !user.role) return false;
    if (Array.isArray(requiredRoles)) {
      return requiredRoles.includes(user.role);
    }
    return user.role === requiredRoles;
  }

  // Obtener usuario por ID
  static async getUserById(id) {
    try {
      const [users] = await pool.query(
        'SELECT id, nombre_usuario, email, rol FROM usuarios WHERE id = ?',
        [id]
      );
      return users[0] || null;
    } catch (error) {
      console.error('Error al obtener usuario por ID:', error);
      return null;
    }
  }
}

export default AuthService;
