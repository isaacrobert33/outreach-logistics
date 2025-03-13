import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { NextResponse } from "next/server";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ALL_SUCCESS_CODES: { [key: number]: string } = {
  200: "Fetched successfully",
  201: "Added successfully",
  202: "Updated successfully",
  204: "Deleted successfully",
  205: "Updated successfully",
  206: "Deleted successfully",
  207: "Copied successfully",
};

const ALL_ERROR_CODES: { [key: number]: string } = {
  404: "Resource not found",
  400: "Validation error",
  401: "Invalid Access Token",
  403: "Access denied",
  500: "Something went wrong",
};
export const Response = (body: {
  status: number;
  message?: any;
  data?: any;
  success?: boolean;
}) => {
  if (body.status in ALL_SUCCESS_CODES) {
    body.message = body.message ? body.message : ALL_SUCCESS_CODES[body.status];
    body.success = true;
  } else if (body.status in ALL_ERROR_CODES) {
    body.message = ALL_ERROR_CODES[body.status];
    body.success = false;
  }
  return NextResponse.json(body, { status: body.status });
};

export const formatNumber = (num: string | number) =>
  num.toString().padStart(3, "0");

export function copyToClipboard(
  text: string,
  onSuccess?: () => void,
  onError?: () => void
) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      if (onSuccess) {
        onSuccess();
      }
    })
    .catch((err) => {
      if (onError) {
        onError();
      }
    });
}
