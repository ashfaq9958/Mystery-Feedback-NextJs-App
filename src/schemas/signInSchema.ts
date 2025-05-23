import { z } from "zod";

// Field-level validations
export const identifierValidation = z
  .string()
  .min(3, { message: "Username or email must be at least 3 characters long" });

export const passwordValidation = z
  .string()
  .min(6, { message: "Password must be at least 6 characters long" });

// Sign-in schema
export const signInSchema = z.object({
  identifier: identifierValidation,
  password: passwordValidation,
});
