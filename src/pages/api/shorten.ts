import type { APIRoute } from 'astro';
import { pool } from '../../../db/index.js';

// Genera código aleatorio de 6 caracteres
function generateCode(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    // 1. Leer el body de la petición
    const body = await request.json();
    const { url } = body;

    // 2. Validar que la URL es válida
    if (!url || !URL.canParse(url)) {
      return new Response(
        JSON.stringify({ error: 'URL inválida' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 3. Generar código único
    let code = generateCode();
    let exists = true;
    
    // Verificar que no exista ya
    while (exists) {
      const result = await pool.query('SELECT 1 FROM short_urls WHERE code = $1', [code]);
      if (result.rowCount === 0) {
        exists = false;
      } else {
        code = generateCode(); // Generar otro si existe
      }
    }

    // 4. Guardar en la base de datos
    await pool.query(
      'INSERT INTO short_urls (code, original_url) VALUES ($1, $2)',
      [code, url]
    );

    // 5. Devolver la URL corta
    const shortUrl = `${new URL(request.url).origin}/${code}`;
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        shortUrl, 
        code 
      }), 
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
