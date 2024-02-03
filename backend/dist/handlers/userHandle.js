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
exports.getUser = exports.filterUser = exports.update = exports.signin = exports.signup = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("../db");
dotenv_1.default.config();
const SECRET = "NO_SECRET_KEY";
const userValidation_1 = require("../validation/userValidation");
function signup(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let { username, password, firstName, lastName } = req.body;
            const { success } = userValidation_1.signupValidation.safeParse({
                username,
                password,
                firstName,
                lastName,
            });
            if (!success) {
                return res.json({
                    success: false,
                    error: "incorrect input ",
                });
            }
            // if user already exist or not
            const userExist = yield db_1.client.query("SELECT * FROM user_details WHERE username=$1;", [username]);
            if (userExist.rows.length > 0) {
                return res.json({
                    success: false,
                    error: `user already exist with the username ${username}`,
                });
            }
            password = yield bcrypt_1.default.hash(password, 10);
            username = username.toLowerCase();
            const data = yield db_1.client.query("INSERT INTO user_details(username,password,first_name,last_name) VALUES($1,$2,$3,$4) RETURNING *;", [username, password, firstName, lastName]);
            const token = jsonwebtoken_1.default.sign({ userId: data.rows[0].id }, SECRET);
            // // depositing random number between 1 to 100000 in the bank
            const randomNumber = Math.floor(Math.random() * 10000) + 1;
            yield db_1.client.query(`
    INSERT INTO account(userId,balance) VALUES($1,$2);
    `, [data.rows[0].id, randomNumber]);
            res.json({
                success: true,
                message: "user successfully signed up",
                token,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(error);
                res.json({
                    error: error.message,
                });
            }
        }
    });
}
exports.signup = signup;
function signin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let { username, password } = req.body;
            username = username.toLowerCase();
            // input validation
            const { success } = userValidation_1.signinValidation.safeParse({
                username,
                password,
            });
            if (!success) {
                return res.json({
                    success: false,
                    error: "incorrect credentials",
                });
            }
            // find the user
            let user = yield db_1.client.query("SELECT username,password,id FROM user_details WHERE username = $1;", [username]);
            if (user.rows.length == 0) {
                return res.json({
                    success: false,
                    error: "user does not exist",
                });
            }
            const hashedPassword = yield bcrypt_1.default.compare(password, user.rows[0].password);
            if (!hashedPassword) {
                return res.json({
                    success: false,
                    error: "invalid credentials",
                });
            }
            const token = jsonwebtoken_1.default.sign({ userId: user.rows[0].id }, SECRET);
            res.json({
                success: true,
                message: "successfully signed in",
                token,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                res.json({
                    success: false,
                    error: error.message,
                });
            }
        }
    });
}
exports.signin = signin;
function update(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.headers["userId"];
            let details = req.body;
            // check if user exist or not in database
            const { success } = userValidation_1.updateDetailsValidation.safeParse(details);
            if (!success) {
                return res.json({
                    success: false,
                    message: "error while updating ",
                });
            }
            if (Object.keys(details).includes("password")) {
                details.password = yield bcrypt_1.default.hash(details.password, 10);
            }
            const valuesArray = Object.entries(details).map(([key, value]) => value);
            const user = yield db_1.client.query(`UPDATE user_details
       SET
       ${Object.entries(details)
                .map((entry, index) => {
                return `${entry[0]} = $${index + 1}`;
            })
                .join(", ")} 
       WHERE id = $${Object.entries(details).length + 1} RETURNING * ;`, [...valuesArray, userId]);
            console.log(user);
            if (user.rows[0].length == 0) {
                return res.json({
                    success: false,
                    message: "user does not exist ",
                });
            }
            res.json({
                success: true,
                message: "details updated successfully",
                details,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(error);
                res.json({
                    success: false,
                    error: error.message,
                });
            }
        }
    });
}
exports.update = update;
function filterUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const query = req.query;
            let user;
            console.log(query.filter);
            if (query.filter) {
                user = yield db_1.client.query(`
        SELECT first_name,last_name,id FROM user_details
        WHERE 
            first_name=$1 OR last_name=$1
      `, [query.filter || null]);
            }
            else {
                user = yield db_1.client.query(`
          SELECT first_name,last_name , id FROM user_details
        `);
            }
            if (user.rows.length == 0) {
                return res.json({
                    success: false,
                    message: "user does not found",
                });
            }
            res.json({
                success: true,
                message: "successfully fetched the user",
                user: user.rows,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                res.json({
                    message: error.message,
                });
            }
        }
    });
}
exports.filterUser = filterUser;
function getUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.headers["userId"];
            if (!userId) {
                return res.json({
                    success: false,
                    message: "invalid userId",
                });
            }
            const user = yield db_1.client.query(`
      SELECT first_name FROM user_details
      WHERE 
          id=$1
    `, [userId]);
            if (user.rows.length === 0) {
                return res.json({
                    success: false,
                    message: "user does not found",
                });
            }
            return res.json({
                success: true,
                message: "successfully fetched the user",
                user: user.rows[0],
            });
        }
        catch (error) {
            res.json({
                success: false,
                message: "server error",
            });
        }
    });
}
exports.getUser = getUser;
