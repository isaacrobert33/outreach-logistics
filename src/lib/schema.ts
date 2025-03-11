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
  outreachId: z.string().optional(), // Add outreachId here
});

export const BankSchema = z.object({
  name: z.string(),
  acctNo: z.string(),
  bank: z.string(),
  outreachId: z.string().nullable(),
  isPublic: z.boolean(),
});

export const OutreachSchema = z.object({
  theme: z.string(),
  description: z.string().optional(),
});
