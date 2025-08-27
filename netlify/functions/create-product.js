// Importa el paquete 'postgres'.
const postgres = require('postgres');

exports.handler = async function(event, context) {
  // Solo permite peticiones de tipo POST.
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Conéctate a la base de datos.
  const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

  try {
    // Extrae los datos del producto que vienen desde el formulario.
    const productData = JSON.parse(event.body);

    const { 
        name, 
        sku, 
        salePrice, 
        purchasePrice, 
        wholesalePrice, 
        quantity, 
        barcode, 
        photoUrl 
    } = productData;

    // Ejecuta la consulta SQL para insertar el nuevo producto.
    // Usar sql`...` previene inyecciones SQL.
    const [newProduct] = await sql`
      INSERT INTO products (
        name, sku, "salePrice", "purchasePrice", "wholesalePrice", quantity, barcode, "photoUrl"
      ) VALUES (
        ${name}, ${sku}, ${salePrice}, ${purchasePrice}, ${wholesalePrice}, ${quantity}, ${barcode}, ${photoUrl}
      )
      RETURNING * `; // 'RETURNING *' devuelve el registro recién creado.

    // Devuelve el producto recién creado.
    return {
      statusCode: 201, // Created
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct),
    };
  } catch (error) {
    // Si hay un error, regístralo y devuelve un error 500.
    console.error('Error al crear el producto:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'No se pudo crear el producto.' }),
    };
  }
};
