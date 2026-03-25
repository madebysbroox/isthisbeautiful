/**
 * Piece by Piece — Cloudflare Worker API
 * Uses D1 (SQLite) for data storage.
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}

function err(message, status = 400) {
  return json({ error: message }, status);
}

export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // GET /api/products — list unsold products
      if (path === '/api/products' && request.method === 'GET') {
        const { results } = await env.DB.prepare(
          'SELECT id, name, slug, description, price_cents, image_url, category FROM products WHERE sold = 0 ORDER BY created_at DESC'
        ).all();
        return json({ data: results });
      }

      // GET /api/products/:slug — single product
      const productMatch = path.match(/^\/api\/products\/([a-z0-9-]+)$/);
      if (productMatch && request.method === 'GET') {
        const row = await env.DB.prepare(
          'SELECT id, name, slug, description, price_cents, image_url, category, sold FROM products WHERE slug = ?'
        ).bind(productMatch[1]).first();
        if (!row) return err('Product not found', 404);
        return json({ data: row });
      }

      // GET /api/testimonials — all testimonials
      if (path === '/api/testimonials' && request.method === 'GET') {
        const { results } = await env.DB.prepare(
          'SELECT id, customer, location, quote, piece_name, rating FROM testimonials ORDER BY created_at DESC'
        ).all();
        return json({ data: results });
      }

      // POST /api/messages — submit contact form
      if (path === '/api/messages' && request.method === 'POST') {
        let body;
        try {
          body = await request.json();
        } catch {
          return err('Invalid JSON body');
        }

        const { name, email, body: msg } = body;
        if (!name || !email || !msg) {
          return err('Name, email, and message are required');
        }
        if (typeof email !== 'string' || !email.includes('@')) {
          return err('Invalid email address');
        }
        if (msg.length > 2000) {
          return err('Message must be under 2000 characters');
        }

        await env.DB.prepare(
          'INSERT INTO messages (name, email, body) VALUES (?, ?, ?)'
        ).bind(name, email, msg).run();

        return json({ success: true }, 201);
      }

      return err('Not found', 404);
    } catch (e) {
      console.error(e);
      return err('Internal server error', 500);
    }
  },
};
