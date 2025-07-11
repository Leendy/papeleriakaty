import AuthService from '../../../lib/auth/auth.service.js';

export async function post({ request }) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return new Response(
        JSON.stringify({ success: false, message: 'Email y contraseña son requeridos' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const result = await AuthService.login(email, password);

    return new Response(
      JSON.stringify({ success: true, ...result }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          'Set-Cookie': `auth_token=${result.token}; Path=/; HttpOnly; Secure; SameSite=Strict${true ? '; Max-Age=86400' : ''}`
        } 
      }
    );
  } catch (error) {
    console.error('Error en login:', error);
    return new Response(
      JSON.stringify({ success: false, message: error.message || 'Error al iniciar sesión' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
