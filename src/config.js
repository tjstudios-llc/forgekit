import { z } from "zod";

export const TEMPLATE_IDS = ["nextjs", "react-vite", "express", "fastify", "fullstack"];
export const DatabaseMode = ["none", "postgres"];

const projectNameSchema = z.string()
  .min(1)
  .max(48)
  .regex(/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/, "Use letters, numbers, hyphens, or underscores.");

const databaseNameSchema = z.string()
  .min(1)
  .max(63)
  .regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/, "PostgreSQL database names must start with a letter or underscore and contain only letters, numbers, and underscores.");

export function validateProjectOptions(input) {
  const name = projectNameSchema.parse(input.name);
  const template = z.enum(TEMPLATE_IDS).parse(input.template);
  const database = z.enum(DatabaseMode).parse(input.database ?? "none");
  const dbName = input.dbName ? databaseNameSchema.parse(input.dbName) : name.replace(/-/g, "_");
  return { ...input, name, template, database, dbName };
}

export function validateDatabaseName(name) {
  return databaseNameSchema.parse(name);
}
