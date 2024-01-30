import { z } from "zod";

export const signupValidation = z.object({
  username: z
    .string()
    .email()
    .max(30, { message: "username length cannot be more than 30" })
    .min(3, { message: "username length cannot be less than 3" })
    .trim(),
  password: z
    .string()
    .min(3, { message: "password length cannot be less than 6" }),

  firstName: z
    .string()
    .min(3)
    .max(30, { message: "firstName length cannot be more than 30" }),
  lastName: z
    .string()
    .min(3)
    .max(30, { message: "firstName length cannot be more than 30" }),
});

export const signinValidation = z.object({
  username: z.string().email(),
  password: z.string(),
});

export const updateDetailsValidation = z.object({
  password: z
    .string()
    .min(6, { message: "password length cannot be less than 6" })
    .optional(),

  firstName: z
    .string()
    .max(30, { message: "firstName length cannot be more than 30" })
    .min(3, { message: "firstName length cannot be less than 3" })
    .optional(),
  lastName: z
    .string()
    .max(30, { message: "lastName length cannot be more than 30" })
    .min(3, { message: "lastName length cannot be less than 3" })
    .optional(),
});
