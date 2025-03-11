import { z } from "zod";

export const PaymentStatus = z.enum(["NOT_PAID", "PENDING", "PAID"]);

export const PaymentSchema = z.object({
  name: z.string().optional(),
  paymentStatus: PaymentStatus.optional(),
  crew: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().min(10).optional().nullable(),
  paidAmount: z
    .number()
    .or(z.string().transform((arg) => parseFloat(arg)))
    .optional(),
  createdAt: z.string().optional(),
  outreachId: z.string().optional(),
  bankId: z.string().optional(),
});

export const BankSchema = z.object({
  name: z.string(),
  acctNo: z.string(),
  bank: z.string(),
  outreachId: z.string().nullable().optional(),
  isPublic: z.boolean(),
});

export const OutreachSchema = z.object({
  theme: z.string(),
  description: z.string().optional(),
});
