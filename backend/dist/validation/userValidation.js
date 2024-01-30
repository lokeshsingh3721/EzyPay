"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDetailsValidation = exports.signinValidation = exports.signupValidation = void 0;
const zod_1 = require("zod");
exports.signupValidation = zod_1.z.object({
    username: zod_1.z
        .string()
        .email()
        .max(30, { message: "username length cannot be more than 30" })
        .min(3, { message: "username length cannot be less than 3" })
        .trim(),
    password: zod_1.z
        .string()
        .min(3, { message: "password length cannot be less than 6" }),
    firstName: zod_1.z
        .string()
        .min(3)
        .max(30, { message: "firstName length cannot be more than 30" }),
    lastName: zod_1.z
        .string()
        .min(3)
        .max(30, { message: "firstName length cannot be more than 30" }),
});
exports.signinValidation = zod_1.z.object({
    username: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
exports.updateDetailsValidation = zod_1.z.object({
    password: zod_1.z
        .string()
        .min(6, { message: "password length cannot be less than 6" })
        .optional(),
    firstName: zod_1.z
        .string()
        .max(30, { message: "firstName length cannot be more than 30" })
        .min(3, { message: "firstName length cannot be less than 3" })
        .optional(),
    lastName: zod_1.z
        .string()
        .max(30, { message: "lastName length cannot be more than 30" })
        .min(3, { message: "lastName length cannot be less than 3" })
        .optional(),
});
