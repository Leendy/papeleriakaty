const http = require('http');

// Opciones para la solicitud HTTP
const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};

// Datos para enviar en la solicitud
const data = JSON.stringify({
  email: 'test@test.com',
  password: 'test123'
});

// Realizar la solicitud HTTP
const req = http.request(options, (res) => {
  console.log(`Estado de la respuesta: ${res.statusCode}`);
  
  let responseData = '';
  
  // Recibir los datos de la respuesta
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  // Cuando se complete la respuesta
  res.on('end', () => {
    console.log('Respuesta del servidor:');
    console.log(responseData);
  });
});

// Manejar errores
req.on('error', (error) => {
  console.error('Error en la solicitud:', error);
});

// Enviar los datos
req.write(data);
req.end();
