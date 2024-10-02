import pg from "pg";

const { Client } = pg;

const client = new Client({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.DATABASE,
  host: process.env.PGHOST ?? "localhost",
  port: parseInt(process.env.PGPORT ?? "5432"),
});

await client.connect();

try {
  await client.query(`
    CREATE TABLE IF NOT EXISTS todo (
      id BIGSERIAL PRIMARY KEY NOT NULL,
      title VARCHAR(150) NOT NULL,
      description TEXT,
      status VARCHAR(7) NOT NULL CHECK (status in ('PENDING', 'DONE')),
      created TIMESTAMPTZ NOT NULL,
      modified TIMESTAMPTZ NOT NULL
    );
  `);
} catch (_) {}

console.log("CONNECTED TO POSTGRES!");
