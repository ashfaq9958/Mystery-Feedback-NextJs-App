import { z } from "zod";

// Modular validation for the verification code
export const verificationCodeValidation = z
  .string()
  .length(6, { message: "Verification code must be exactly 6 characters long" });

// Final schema
export const verifySchema = z.object({
  code: verificationCodeValidation,
});
