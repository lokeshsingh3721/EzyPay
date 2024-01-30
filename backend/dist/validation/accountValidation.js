"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const bank = zod_1.z.object({
    userId: zod_1.z.string(),
    balance: zod_1.z.number(),
});
exports.default = bank;
