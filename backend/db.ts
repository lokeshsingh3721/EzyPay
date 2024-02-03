import { Client } from "pg";
import { UserTable } from "./models/userModel";
import { BankTable } from "./models/bankModel";

export const client = new Client({
  host: "localhost",
  port: 5432,
  database: "paytm",
  user: "postgres",
  password: "Lokesh3721@#",
});

export async function dbConnect() {
  try {
    client.connect(async (err) => {
      if (err) {
        console.log(err);
      } else {
        await UserTable();
        await BankTable();
        console.log("connected");
      }
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }
}
