import { client } from "../db";

import { Request, Response } from "express";
import bank from "../validation/accountValidation";
import { error } from "console";

interface ReceiverDetails {
  userId: string;
  balance: number;
}

// // async function deposit(userDetails) {
// //   try {
// //     const { userId, balance } = userDetails;
// //     const user = await Bank.findOne({ userId: userId });
// //     if (!user) {
// //       const deposit = await Bank.create(userDetails);
// //       return {
// //         message: "successfully deposited in your account",
// //         deposit,
// //       };
// //     }

// //     const updatedDeposit = await Bank.findOneAndUpdate(
// //       { userId: userId }, // Query criteria
// //       { $inc: { balance: balance } }, // Update operation
// //       { new: true }
// //     );

// //     return {
// //       message: "successfully deposited in your account",
// //       updatedDeposit,
// //     };
// //   } catch (error) {
// //     return {
// //       message: "internal server occured",
// //     };
// //   }
// // }

export async function transferFunds(req: Request, res: Response) {
  try {
    let { userId, balance }: ReceiverDetails = req.body;
    balance = Number(balance);
    const receiverDetails = { userId, balance };
    let senderId: unknown = req.headers["userId"];

    const { success } = bank.safeParse({ userId, balance });
    if (!success) {
      return res.json({
        success: false,
        message: "invalid inputs",
      });
    }

    if (!((await getBalance(senderId)) >= receiverDetails.balance)) {
      return res.json({
        success: false,
        message: "low balance ",
      });
    }

    const data: any = await transaction(senderId, receiverDetails);
    res.json({
      data,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "internal server error ",
    });
  }
}

export async function balance(req: Request, res: Response) {
  try {
    const userId = req.headers["userId"];
    const balance = await getBalance(userId);
    res.json({
      success: true,
      balance,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "internal server error",
    });
  }
}

async function getBalance(userId: unknown): Promise<number> {
  try {
    const balanceDetails = await client.query(
      `
      SELECT balance FROM account
      WHERE userId = $1;
    `,
      [userId]
    );
    if (balanceDetails.rows.length > 0) {
      return balanceDetails.rows[0].balance;
    }
    return -1;
  } catch (error) {
    return -1;
  }
}

export async function transaction(
  senderId: unknown,
  receiverDetails: ReceiverDetails
) {
  try {
    await client.query("BEGIN;"); // starting the transaction

    let sender = await client.query("SELECT * FROM account WHERE userId=$1;", [
      senderId,
    ]);

    if (sender.rows.length == 0) {
      return {
        success: false,
        message: "Sender account not found",
      };
    }

    let receiver = await client.query(
      "SELECT * FROM account WHERE userId=$1;",
      [receiverDetails.userId]
    );

    if (receiver.rows.length == 0) {
      return {
        success: false,
        message: "Reciever account not found",
      };
    }

    sender = await client.query(
      `
    UPDATE account 
    SET balance = balance - $1
    WHERE userId = $2 RETURNING *;
    `,
      [receiverDetails.balance, senderId]
    );

    receiver = await client.query(
      `
    UPDATE account 
    SET balance = balance + $1
    WHERE userId = $2 RETURNING *;
    `,
      [receiverDetails.balance, receiverDetails.userId]
    );

    await client.query("COMMIT;"); // committing the transaction

    return {
      success: true,
      balance: sender.rows[0].balance,
    };
  } catch (error: unknown) {
    await client.query("ROLLBACK;"); // rollback on any error

    if (error instanceof Error) {
      return {
        message: error.message,
      };
    }
  }
}
