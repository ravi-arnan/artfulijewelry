import { createClient, type Client } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

// Fallback otomatis ke SQLite lokal jika TURSO_DATABASE_URL belum diatur di .env.local
const url = process.env.TURSO_DATABASE_URL || "file:local.db";
const authToken = process.env.TURSO_AUTH_TOKEN;

function initClient(): Client {
  try {
    return createClient({
      url,
      authToken,
    });
  } catch (err) {
    console.warn("Falling back to in-memory SQLite client:", err);
    return createClient({
      url: ":memory:",
    });
  }
}

export const client = initClient();
export const db = drizzle(client, { schema });
