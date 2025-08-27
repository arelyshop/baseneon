// Importa el paquete 'postgres' para conectarte a tu base de datos Neon.
// Asegúrate de haber ejecutado: npm install postgres
const postgres = require('postgres');

// La función principal que Netlify ejecutará.
exports.handler = async function(event, context) {
  // Conéctate a tu base de datos Neon usando la URL de las variables de entorno de Netlify.
  // Netlify automáticamente usará la variable que creaste.
  const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

  try {
    // Ejecuta una consulta SQL para seleccionar todos los productos.
    // Asegúrate de que tu tabla en Neon se llame 'products'.
    const products = await sql`SELECT * FROM products ORDER BY id DESC`;

    // Si la consulta es exitosa, devuelve los productos.
    return {
      statusCode: 200, // OK
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(products),
    };
  } catch (error) {
    // Si hay un error, regístralo en la consola de Netlify.
    console.error('Error al obtener productos:', error);

    // Devuelve un error 500.
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'No se pudieron obtener los productos.' }),
    };
  }
};
