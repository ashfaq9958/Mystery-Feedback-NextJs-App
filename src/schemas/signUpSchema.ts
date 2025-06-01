import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, { message: "Username must be at least 2 characters long" })
  .max(20, { message: "Username must be no more than 20 characters" })
  .regex(/^[a-zA-Z0-9_]+$/, {
    message: "Username must use only letters, numbers, or underscores.",
  });

export const emailValidation = z
  .string()
  .email({ message: "Invalid email address" });

export const passwordValidation = z
  .string()
  .min(6, { message: "Password must be at least 6 characters long" });

export const signUpSchema = z.object({
  username: usernameValidation,
  email: emailValidation,
  password: passwordValidation,
});
