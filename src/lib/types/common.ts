import { z } from "zod";
import { PaymentSchema } from "../schema";

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
