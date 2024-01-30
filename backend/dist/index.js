"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const index_1 = __importDefault(require("./routes/index"));
const db_1 = require("./db");
const PORT = 3000;
// middlewares
app.use(express_1.default.urlencoded());
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("tiny"));
// redirecting /api/v1 routes
app.use("/api/v1", index_1.default);
// connecting to the database
(0, db_1.dbConnect)();
app.listen(PORT, () => {
    console.log("app is listening to the port " + PORT);
});
