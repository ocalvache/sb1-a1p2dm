import express from 'express';
import Database from 'better-sqlite3';
import { z } from 'zod';

const app = express();
const PORT = 3001;

app.use(express.json());

// Initialize SQLite database
const db = new Database('customers.db');

// Create customers table
db.exec(`
  CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    address TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Customer validation schema
const CustomerSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

// Routes
app.post('/api/customers', (req, res) => {
  try {
    const customer = CustomerSchema.parse(req.body);
    const stmt = db.prepare(`
      INSERT INTO customers (firstName, lastName, email, phone, address)
      VALUES (@firstName, @lastName, @email, @phone, @address)
    `);
    const result = stmt.run(customer);
    res.status(201).json({ id: result.lastInsertRowid, ...customer });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/customers', (req, res) => {
  const customers = db.prepare('SELECT * FROM customers ORDER BY createdAt DESC').all();
  res.json(customers);
});

app.listen(PORT, () => {
  console.log(`Customer service running on port ${PORT}`);
});