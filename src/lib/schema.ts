import { date, z } from "zod";

export const PaymentStatus = z.enum(["NOT_PAID", "PENDING", "PAID", "PARTIAL"]);
export const GenderSchema = z.enum(["UNSPECIFIED", "MALE", "FEMALE"]);

export const PaymentSchema = z.object({
  name: z.string().optional(),
  paymentStatus: PaymentStatus.optional(),
  gender: GenderSchema.optional(),
  crew: z.string().optional(),
  email: z.string().nullable().optional(),
  phone: z.string().min(10).optional().nullable(),
  paidAmount: z
    .number()
    .min(500)
    .or(
      z
        .string()
        .min(3)
        .transform((arg) => parseFloat(arg)),
    )
    .optional(),

  pendingAmount: z
    .number()
    .or(z.string().transform((arg) => parseFloat(arg)))
    .optional(),
  createdAt: z.string().optional(),
  outreachId: z.string().optional(),
  bankId: z.string().optional(),
  level: z.string().nullable().optional(),
  proof_image: z.array(z.string()).nullable().optional(),
  unit: z.string().optional().nullable().default("President"),
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
  location: z.string().optional(),
  isActive: z.boolean().optional(),
  flyer: z.string().optional().nullable(),
  date: z.string().optional(),
  fee: z
    .number()
    .or(z.string().transform((arg) => parseFloat(arg)))
    .optional(),
});
