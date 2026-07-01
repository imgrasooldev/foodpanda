// Lightweight in-memory order relay so the customer and vendor apps share
// live order state WITHOUT a database. Real cross-app approval:
//   customer POSTs an order -> vendor GETs it -> vendor PATCHes the status
//   -> customer polls and sees the change.
//
// Run:  node apps/order-sync/server.mjs   (listens on :4100)
import { createServer } from 'node:http';

const PORT = process.env.SYNC_PORT ? Number(process.env.SYNC_PORT) : 4100;

/** @type {Map<string, any>} */
const orders = new Map();

// Seed a couple of demo orders so the vendor board isn't empty on first run.
for (const o of [
  {
    id: 'seed-1', number: 'FR-SEED01', customerName: 'Ayesha Khan',
    restaurantName: 'Student Biryani', restaurantSlug: 'student-biryani',
    items: [{ name: 'Chicken Biryani', quantity: 2, price: 320 }],
    total: 769, paymentMethod: 'CASH_ON_DELIVERY', status: 'PLACED',
    placedAt: Date.now() - 60000,
  },
  {
    id: 'seed-2', number: 'FR-SEED02', customerName: 'Hamza Ali',
    restaurantName: 'Student Biryani', restaurantSlug: 'student-biryani',
    items: [{ name: 'Beef Biryani', quantity: 1, price: 380 }, { name: 'Soft Drink 345ml', quantity: 1, price: 120 }],
    total: 629, paymentMethod: 'JAZZCASH', status: 'PREPARING',
    placedAt: Date.now() - 300000,
  },
]) {
  orders.set(o.id, o);
}

function send(res, status, body) {
  const data = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(data);
}

function readBody(req) {
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', (c) => (raw += c));
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        resolve({});
      }
    });
  });
}

const server = createServer(async (req, res) => {
  const { method } = req;
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const path = url.pathname;

  if (method === 'OPTIONS') return send(res, 204, {});
  if (path === '/health') return send(res, 200, { ok: true, count: orders.size });

  // Collection
  if (path === '/orders') {
    if (method === 'GET') {
      const list = [...orders.values()].sort((a, b) => b.placedAt - a.placedAt);
      return send(res, 200, list);
    }
    if (method === 'POST') {
      const body = await readBody(req);
      if (!body.id) body.id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const order = { ...body, status: body.status || 'PLACED', updatedAt: Date.now() };
      orders.set(order.id, order);
      return send(res, 201, order);
    }
  }

  // Single order:  /orders/:id
  const match = path.match(/^\/orders\/([^/]+)$/);
  if (match) {
    const id = decodeURIComponent(match[1]);
    const existing = orders.get(id);
    if (method === 'GET') {
      if (!existing) return send(res, 404, { error: 'not found' });
      return send(res, 200, existing);
    }
    if (method === 'PATCH') {
      if (!existing) return send(res, 404, { error: 'not found' });
      const body = await readBody(req);
      const updated = { ...existing, ...body, id, updatedAt: Date.now() };
      orders.set(id, updated);
      return send(res, 200, updated);
    }
  }

  // Reset (dev helper)
  if (path === '/reset' && method === 'POST') {
    orders.clear();
    return send(res, 200, { ok: true });
  }

  send(res, 404, { error: 'unknown route' });
});

server.listen(PORT, () => {
  console.log(`FoodRush order-sync running on http://localhost:${PORT}`);
});
