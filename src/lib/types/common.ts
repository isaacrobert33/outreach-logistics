import { PaymentSchema } from "@/app/api/v1/payments/route";
import { z } from "zod";

export interface ResponseProps {
  status: number;
  message: string;
  data?: any;
  error?: any;
}

export interface PaymentType extends z.infer<typeof PaymentSchema> {
  id: string;
  createdAt?: string;
}
