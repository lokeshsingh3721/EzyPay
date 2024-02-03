import pg from "pg";
import { client } from "../db";

export async function UserTable() {
  const table = await client.query(
    "CREATE TABLE IF NOT EXISTS user_details (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), username TEXT UNIQUE NOT NULL, password TEXT NOT NULL, first_name TEXT NOT NULL, last_name TEXT NOT NULL)"
  );
}
