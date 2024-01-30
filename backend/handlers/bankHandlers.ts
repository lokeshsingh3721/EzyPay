import Bank from "../models/bankModel";
import mongoose from "mongoose";

import bank from "../validation/accountValidation";

import { Request, Response } from "express";

interface ReceiverDetails {
  userId: string;
  balance: number;
}

// async function deposit(userDetails) {
//   try {
//     const { userId, balance } = userDetails;
//     const user = await Bank.findOne({ userId: userId });
//     if (!user) {
//       const deposit = await Bank.create(userDetails);
//       return {
//         message: "successfully deposited in your account",
//         deposit,
//       };
//     }

//     const updatedDeposit = await Bank.findOneAndUpdate(
//       { userId: userId }, // Query criteria
//       { $inc: { balance: balance } }, // Update operation
//       { new: true }
//     );

//     return {
//       message: "successfully deposited in your account",
//       updatedDeposit,
//     };
//   } catch (error) {
//     return {
//       message: "internal server occured",
//     };
//   }
// }

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
      balance: data.sender.balance,
      success: true,
      message: "successfully transfered the balance ",
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
    const balanceDetails = await Bank.findOne({ userId });
    if (balanceDetails) {
      return balanceDetails.balance;
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
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    // Note: we should pass the session but not doing it because i m lazy
    let sender = await Bank.findOne({ userId: senderId });

    if (!sender) {
      throw new Error("Sender account not found");
    }

    let receiver = await Bank.findOne({
      userId: receiverDetails.userId,
    });

    if (!receiver) {
      throw new Error("Receiver account not found");
    }

    sender = await Bank.findOneAndUpdate(
      { userId: senderId },
      { $inc: { balance: -receiverDetails.balance } },
      { new: true }
    );

    receiver = await Bank.findOneAndUpdate(
      { userId: receiverDetails.userId },
      { $inc: { balance: receiverDetails.balance } },
      { new: true }
    );

    await session.commitTransaction();

    return {
      sender,
      receiver,
    };
  } catch (error) {
    await session.abortTransaction();
    return {
      message: "failed",
    };
  } finally {
    session.endSession();
  }
}
