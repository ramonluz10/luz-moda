/**
 * db.js — Database abstraction layer for Luz Moda
 *
 * Connects to PostgreSQL via DATABASE_URL and initialises the schema on
 * startup.  While the schema is being set up all route modules share the
 * same in-memory arrays so the server can serve requests immediately.
 * Once the DB is ready, persist/query calls can be migrated here
 * incrementally without touching the route files.
 */

const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');

// ── PostgreSQL connection pool ────────────────────────────────────────────
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost')
    ? { rejectUnauthorized: false }
    : false,
});

pool.on('error', (err) => {
  console.error('[DB] Unexpected pool error:', err.message);
});

// ── Schema initialisation ─────────────────────────────────────────────────
async function initDB() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id          TEXT        PRIMARY KEY,
        name        TEXT        NOT NULL,
        email       TEXT        NOT NULL UNIQUE,
        password    TEXT        NOT NULL,
        role        TEXT        NOT NULL DEFAULT 'customer',
        "vipLevel"  TEXT        NOT NULL DEFAULT 'standard',
        points      INTEGER     NOT NULL DEFAULT 0,
        active      BOOLEAN     NOT NULL DEFAULT TRUE,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        addresses   JSONB       NOT NULL DEFAULT '[]',
        orders      JSONB       NOT NULL DEFAULT '[]'
      );
    `);
    console.log('[DB] Schema ready.');
  } catch (err) {
    console.error('[DB] Schema initialisation failed:', err.message);
  } finally {
    client.release();
  }
}

// Attempt to connect and initialise; non-fatal if DATABASE_URL is absent
// (e.g. local dev without Postgres) — the in-memory arrays still work.
if (process.env.DATABASE_URL) {
  pool.connect()
    .then((client) => {
      console.log('[DB] Connected to PostgreSQL.');
      client.release();
      return initDB();
    })
    .catch((err) => {
      console.error('[DB] Could not connect to PostgreSQL:', err.message);
      console.warn('[DB] Falling back to in-memory store.');
    });
} else {
  console.warn('[DB] DATABASE_URL not set — using in-memory store only.');
}

// ── In-memory stores (shared mutable arrays) ──────────────────────────────
// All route modules hold a reference to these arrays, so mutations made in
// one route (e.g. users.push(…)) are immediately visible in all others.
const users       = [];
const orders      = [];
const products    = [];
const reviews     = [];
const carts       = [];
const wishlists   = [];
const coupons     = [];
const blogPosts   = [];
const stockAlerts = [];
const subscribers = [];

// ── Exports ───────────────────────────────────────────────────────────────
module.exports = {
  // pg pool — available for direct queries when needed
  pool,

  // in-memory stores
  users,
  orders,
  products,
  reviews,
  carts,
  wishlists,
  coupons,
  blogPosts,
  stockAlerts,
  subscribers,

  // uuid helper expected by route modules
  uuidv4,
};
