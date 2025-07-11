import { parse } from 'cookie';
import AuthService from '../lib/auth/auth.service.js';
import { protectedRoutes, publicRoutes } from '../lib/auth/config.js';

export async function authMiddleware({ request, redirect }) {
  const { pathname } = new URL(request.url);

  // Verificar si la ruta es pública
  const isPublicRoute = publicRoutes.some(route => {
    if (route.endsWith('*')) {
      return pathname.startsWith(route.slice(0, -1));
    }
    return pathname === route;
  });

  if (isPublicRoute) {
    return;
  }

  // Obtener el token de las cookies
  const cookies = parse(request.headers.get('cookie') || '');
  const token = cookies.auth_token;

  if (!token) {
    return redirect('/login');
  }

  try {
    // Verificar el token
    const user = AuthService.verifyToken(token);
    
    // Verificar si el usuario tiene acceso a la ruta solicitada
    const requiredRoles = [];
    
    for (const [route, roles] of Object.entries(protectedRoutes)) {
      if (pathname.startsWith(route)) {
        requiredRoles.push(...roles);
      }
    }

    if (requiredRoles.length > 0 && !AuthService.hasRole(user, requiredRoles)) {
      return redirect('/unauthorized');
    }

    // Agregar el usuario al contexto de la solicitud
    return {
      user,
      token
    };
  } catch (error) {
    console.error('Error de autenticación:', error);
    return redirect('/login');
  }
}
