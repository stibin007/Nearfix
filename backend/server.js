require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM providers');
    res.json({ status: 'ok', providers: result.rows[0].count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});
// ---------- Services ----------
app.get('/api/services', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name FROM services ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// ---------- Areas ----------
app.get('/api/areas', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, district FROM areas ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch areas' });
  }
});

// ---------- Providers ----------
// The same SELECT is used for the list and for a single provider.
const PROVIDER_SELECT = `
  SELECT
    p.id,
    p.name,
    p.type,
    p.phone,
    p.description,
    p.experience_years,
    p.created_at,
    a.id AS area_id,
    a.name AS area,
    a.district,
    COALESCE(
      (SELECT json_agg(json_build_object('id', s.id, 'name', s.name))
       FROM provider_services ps
       JOIN services s ON s.id = ps.service_id
       WHERE ps.provider_id = p.id),
      '[]'::json
    ) AS services
  FROM providers p
  LEFT JOIN areas a ON a.id = p.area_id
`;

// List and filter: /api/providers?service=1&area=2
app.get('/api/providers', async (req, res) => {
  try {
    const service = req.query.service ? parseInt(req.query.service, 10) : null;
    const area = req.query.area ? parseInt(req.query.area, 10) : null;

    if (Number.isNaN(service) || Number.isNaN(area)) {
      return res.status(400).json({ error: 'service and area must be numbers' });
    }

    const result = await pool.query(
      `${PROVIDER_SELECT}
       WHERE ($1::int IS NULL OR p.id IN (
               SELECT provider_id FROM provider_services WHERE service_id = $1))
         AND ($2::int IS NULL OR p.area_id = $2)
       ORDER BY p.experience_years DESC NULLS LAST, p.name`,
      [service, area]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch providers' });
  }
});

// One provider: /api/providers/3
app.get('/api/providers/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'id must be a number' });
    }

    const result = await pool.query(`${PROVIDER_SELECT} WHERE p.id = $1`, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Provider not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch provider' });
  }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, (err) => {
  if (err) {
    console.error('Could not start server:', err.message);
    process.exit(1);
  }
  console.log(`Server running on port ${PORT}`);
});