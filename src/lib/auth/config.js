// Configuración de autenticación
export const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_seguro_aqui';
export const JWT_EXPIRES_IN = '24h';

export const ROLES = {
  ADMIN: 'admin',
  CLIENT: 'client'
};

// Lista de rutas protegidas y sus roles requeridos
export const protectedRoutes = {
  '/admin': [ROLES.ADMIN],
  '/admin/editar-producto': [ROLES.ADMIN],
  // Agrega más rutas protegidas según sea necesario
};

// Rutas públicas que no requieren autenticación
export const publicRoutes = [
  '/',
  '/login',
  '/productos',
  '/servicios',
  '/contacto',
  '/api/auth/login',
  // No se incluye el registro ya que no será necesario
];
