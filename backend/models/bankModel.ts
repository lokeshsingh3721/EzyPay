import { client } from "../db";

export async function BankTable() {
  const table = await client.query(
    "CREATE TABLE IF NOT EXISTS account (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), userId UUID UNIQUE NOT NULL, balance INT NOT NULL, FOREIGN KEY (userId) REFERENCES user_details(id))"
  );
}
