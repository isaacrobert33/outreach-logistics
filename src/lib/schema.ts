import { z } from "zod";

export const PaymentStatus = z.enum(["NOT_PAID", "PENDING", "PAID"]);

export const PaymentSchema = z.object({
  name: z.string().optional(),
  paymentStatus: PaymentStatus.optional(),
  crew: z.string().optional(),
  email: z.string().email().optional(),
  paidAmount: z
    .number()
    .or(z.string().transform((arg) => parseFloat(arg)))
    .optional(),
  createdAt: z.string().optional(),
});
