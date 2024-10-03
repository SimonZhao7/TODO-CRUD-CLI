import pg from "pg";
import { program } from "commander";
import * as readline from "readline-sync";

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
      status VARCHAR(7) NOT NULL CHECK (status in ('PENDING', 'DONE')) DEFAULT 'PENDING',
      created TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      modified TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
} catch (_) {}

program
  .command("new")
  .description("Creates a new todo entry")
  .option("--title <title>", "todo title")
  .option("--description <description>", "todo desciption");

console.log("CONNECTED TO POSTGRES!");

console.log("WELCOME TO THE TODO CLI");

let cmd: string;
while ((cmd = readline.question("Enter a command: ")) != "q") {
  const data = new Map();
  for (const word of cmd.split(" ")) {
  }
}

client.end();

async function getTodos(limit: number, offset: number, categories: string[]) {
  let query = `SELECT * FROM todo WHERE status IN (${categories.join(", ")})`;

  if (limit) {
    query += `LIMIT ${limit}`;
  }

  if (offset) {
    query += `OFFSET ${offset}`;
  }
  await client.query(`${query};`);
}

async function addTodo(title: string, description: string) {
  await client.query(`
    INSERT INTO todo (title, description) VALUES (${title}, ${description});
  `);
}

async function updateTodo(
  id: number,
  title: string,
  description: string,
  status: string
) {
  let query = "UPDATE todo SET";

  if (title) {
    query += `title = '${title}'`;
  }

  if (description) {
    query += `description = '${description}'`;
  }

  if (status) {
    query += `status = '${status}'`;
  }
  await client.query(`${query} WHERE id = '${id}';`);
}

async function deleteTodo(id: number) {
  await client.query(`
    DELETE FROM todo WHERE id = '${id}';
  `);
}
