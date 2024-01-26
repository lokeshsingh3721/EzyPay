const { z } = require("zod");

const bank = z.object({
  userId: z.string(),
  balance: z.number(),
});

module.exports = { bank };
