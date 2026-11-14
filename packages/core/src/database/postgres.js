import pg from "pg";
import { validateDatabaseName } from "../config.js";
const { Client } = pg;
export async function provisionDatabase({ adminUrl, databaseName }) {
  if (!adminUrl) throw new Error("A PostgreSQL provisioning URL is required.");
  const safeName = validateDatabaseName(databaseName);
  const client = new Client({ connectionString: adminUrl, connectionTimeoutMillis: 10000 });
  await client.connect();
  try {
    const found = await client.query("SELECT 1 FROM pg_database WHERE datname = $1", [safeName]);
    if (found.rowCount) return { created: false, alreadyExists: true, databaseName: safeName };
    await client.query(`CREATE DATABASE "${safeName.replaceAll('"', '""')}"`);
    return { created: true, databaseName: safeName };
  } finally { await client.end(); }
}
