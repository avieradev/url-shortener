import type { APIRoute } from 'astro';
import { pool } from '../../db/index.js';

export const GET: APIRoute = async ({ params, redirect }) => {
  const { code } = params;

  try {
    // 1. Buscar la URL original
    const result = await pool.query(
      'SELECT original_url FROM short_urls WHERE code = $1',
      [code]
    );

    // 2. Si no existe, error 404
    if (result.rowCount === 0) {
      return new Response('URL no encontrada', { status: 404 });
    }

    const originalUrl = result.rows[0].original_url;

    // 3. Actualizar contador (async, no esperamos)
    pool.query(
      'UPDATE short_urls SET clicks = clicks + 1, last_clicked_at = NOW() WHERE code = $1',
      [code]
    );

    // 4. Redirigir
    return redirect(originalUrl, 302);

  } catch (error) {
    console.error('Error:', error);
    return new Response('Error del servidor', { status: 500 });
  }
};
