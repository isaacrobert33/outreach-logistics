import { z } from "zod";
import { PaymentSchema, BankSchema, OutreachSchema } from "../schema";

export interface ResponseProps {
  status: number;
  message: string;
  data?: any;
  error?: any;
}

export interface PaymentType extends z.infer<typeof PaymentSchema> {
  id: string;
  outreach?: string;
  createdAt?: string;
  bank?: string;
  proof_image?: string[];
}

export interface BankType extends z.infer<typeof BankSchema> {
  id: string;
  createdAt?: string;
}
export interface OutreachType extends z.infer<typeof OutreachSchema> {
  id: string;
  createdAt?: string;
}
