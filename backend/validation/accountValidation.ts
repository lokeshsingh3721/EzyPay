import { z } from "zod";

const bank = z.object({
  userId: z.string(),
  balance: z.number(),
});

export default bank;
