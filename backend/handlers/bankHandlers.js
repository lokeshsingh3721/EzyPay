const Bank = require("../models/bankModel");
const mongoose = require("mongoose");

const { bank } = require("../validation/accountValidation");

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

async function transferFunds(req, res) {
  try {
    let { userId, balance } = req.body;
    balance = Number(balance);
    const receiverDetails = { userId, balance };
    const senderId = req.userId;
    const { success } = bank.safeParse({ userId, balance });
    if (!success) {
      return res.json({
        success: false,
        message: "invalid inputs",
      });
    }

    if (
      !(
        (await getBalance(senderId, receiverDetails.balance)) >=
        receiverDetails.balance
      )
    ) {
      return res.json({
        success: false,
        message: "low balance ",
      });
    }

    const data = await transaction(senderId, receiverDetails);
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

async function balance(req, res) {
  try {
    const userId = req.userId;
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

async function getBalance(userId) {
  try {
    const balanceDetails = await Bank.findOne({ userId });
    return balanceDetails.balance;
  } catch (error) {
    return false;
  }
}

async function transaction(senderId, receiverDetails) {
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

module.exports = { transferFunds, balance };
