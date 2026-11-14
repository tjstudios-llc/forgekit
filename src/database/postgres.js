import pg from "pg";
import { validateDatabaseName } from "../config.js";

const { Client } = pg;

export async function provisionDatabase({ adminUrl, databaseName }) {
  const safeName = validateDatabaseName(databaseName);
  const client = new Client({ connectionString: adminUrl, connectionTimeoutMillis: 10000 });
  await client.connect();
  try {
    const result = await client.query("SELECT 1 FROM pg_database WHERE datname = $1", [safeName]);
    if (result.rowCount > 0) return { created: false, alreadyExists: true, databaseName: safeName };
    const quotedName = `"${safeName.replaceAll('"', '""')}"`;
    await client.query(`CREATE DATABASE ${quotedName}`);
    return { created: true, databaseName: safeName };
  } finally {
    await client.end();
  }
}
