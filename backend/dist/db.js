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
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConnect = exports.client = void 0;
const pg_1 = require("pg");
const userModel_1 = require("./models/userModel");
const bankModel_1 = require("./models/bankModel");
exports.client = new pg_1.Client({
    host: "localhost",
    port: 5432,
    database: "paytm",
    user: "postgres",
    password: "Lokesh3721@#",
});
function dbConnect() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            exports.client.connect((err) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    console.log(err);
                }
                else {
                    yield (0, userModel_1.UserTable)();
                    yield (0, bankModel_1.BankTable)();
                    console.log("connected");
                }
            }));
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
            }
        }
    });
}
exports.dbConnect = dbConnect;
