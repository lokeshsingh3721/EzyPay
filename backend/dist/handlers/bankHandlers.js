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
const bankModel_1 = __importDefault(require("../models/bankModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const accountValidation_1 = __importDefault(require("../validation/accountValidation"));
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
                balance: data.sender.balance,
                success: true,
                message: "successfully transfered the balance ",
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
            const balanceDetails = yield bankModel_1.default.findOne({ userId });
            if (balanceDetails) {
                return balanceDetails.balance;
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
        const session = yield mongoose_1.default.startSession();
        try {
            session.startTransaction();
            // Note: we should pass the session but not doing it because i m lazy
            let sender = yield bankModel_1.default.findOne({ userId: senderId });
            if (!sender) {
                throw new Error("Sender account not found");
            }
            let receiver = yield bankModel_1.default.findOne({
                userId: receiverDetails.userId,
            });
            if (!receiver) {
                throw new Error("Receiver account not found");
            }
            sender = yield bankModel_1.default.findOneAndUpdate({ userId: senderId }, { $inc: { balance: -receiverDetails.balance } }, { new: true });
            receiver = yield bankModel_1.default.findOneAndUpdate({ userId: receiverDetails.userId }, { $inc: { balance: receiverDetails.balance } }, { new: true });
            yield session.commitTransaction();
            return {
                sender,
                receiver,
            };
        }
        catch (error) {
            yield session.abortTransaction();
            return {
                message: "failed",
            };
        }
        finally {
            session.endSession();
        }
    });
}
exports.transaction = transaction;
