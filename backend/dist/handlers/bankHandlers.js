"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transaction = exports.balance = exports.transferFunds = void 0;
const db_1 = require("../db");
const accountValidation_1 = __importDefault(require("../validation/accountValidation"));
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
function transferFunds(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let { userId, balance } = req.body;
            balance = Number(balance);
            const receiverDetails = { userId, balance };
            let senderId = req.headers["userId"];
            const { success } = accountValidation_1.default.safeParse({ userId, balance });
            if (!success) {
                return res.json({
                    success: false,
                    message: "invalid inputs",
                });
            }
            if (!((yield getBalance(senderId)) >= receiverDetails.balance)) {
                return res.json({
                    success: false,
                    message: "low balance ",
                });
            }
            const data = yield transaction(senderId, receiverDetails);
            res.json({
                data,
            });
        }
        catch (error) {
            res.json({
                success: false,
                message: "internal server error ",
            });
        }
    });
}
exports.transferFunds = transferFunds;
function balance(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.headers["userId"];
            const balance = yield getBalance(userId);
            res.json({
                success: true,
                balance,
            });
        }
        catch (error) {
            res.json({
                success: false,
                message: "internal server error",
            });
        }
    });
}
exports.balance = balance;
function getBalance(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const balanceDetails = yield db_1.client.query(`
      SELECT balance FROM account
      WHERE userId = $1;
    `, [userId]);
            if (balanceDetails.rows.length > 0) {
                return balanceDetails.rows[0].balance;
            }
            return -1;
        }
        catch (error) {
            return -1;
        }
    });
}
function transaction(senderId, receiverDetails) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield db_1.client.query("BEGIN;"); // starting the transaction
            let sender = yield db_1.client.query("SELECT * FROM account WHERE userId=$1;", [
                senderId,
            ]);
            if (sender.rows.length == 0) {
                return {
                    success: false,
                    message: "Sender account not found",
                };
            }
            let receiver = yield db_1.client.query("SELECT * FROM account WHERE userId=$1;", [receiverDetails.userId]);
            if (receiver.rows.length == 0) {
                return {
                    success: false,
                    message: "Reciever account not found",
                };
            }
            sender = yield db_1.client.query(`
    UPDATE account 
    SET balance = balance - $1
    WHERE userId = $2 RETURNING *;
    `, [receiverDetails.balance, senderId]);
            receiver = yield db_1.client.query(`
    UPDATE account 
    SET balance = balance + $1
    WHERE userId = $2 RETURNING *;
    `, [receiverDetails.balance, receiverDetails.userId]);
            yield db_1.client.query("COMMIT;"); // committing the transaction
            return {
                success: true,
                balance: sender.rows[0].balance,
            };
        }
        catch (error) {
            yield db_1.client.query("ROLLBACK;"); // rollback on any error
            if (error instanceof Error) {
                return {
                    message: error.message,
                };
            }
        }
    });
}
exports.transaction = transaction;
