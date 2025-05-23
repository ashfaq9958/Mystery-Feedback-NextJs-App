import { z } from "zod";

export const acceptMessageSchema = z.object({
  acceptMessages: z.boolean(),
});


// import { z } from "zod";

// export const acceptMessagesValidation = z.boolean({
//   required_error: "Accept messages field is required",
// });

// export const acceptMessageSchema = z.object({
//   acceptMessages: acceptMessagesValidation,
// });
