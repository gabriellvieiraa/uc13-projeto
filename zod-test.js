import { z } from 'zod';

const schema = z.object({
  type: z.enum(["ADMIN", "DIRECTOR"]).optional()
});

try {
  schema.parse({ type: "TEACHER" });
  console.log("PASSOU: Zod não bloqueou!");
} catch (e) {
  console.log("BLOQUEOU: Zod funcionou e gerou erro.");
  console.log(e);
}
