import { z } from "zod";

// Individual validation rule for message content
export const messageContentValidation = z
  .string()
  .min(10, { message: "Content must be at least 10 characters long" })
  .max(300, { message: "Content must be no more than 300 characters long" });

// Message schema using the modular rule
export const messageSchema = z.object({
  content: messageContentValidation,
});
