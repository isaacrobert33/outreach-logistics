"use client";

import { Button } from "@/components/ui/button";
import { CldImage } from "next-cloudinary";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { motion, AnimatePresence } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { BankType, OutreachType, PaymentType } from "@/lib/types/common";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PaymentSchema } from "@/lib/schema";
import FileUpload from "@/components/file-uploader";
import axios, { AxiosError, AxiosResponse } from "axios";
import { ExtFile } from "@files-ui/react";
import CrewSelect from "@/components/crews-select";
import { copyToClipboard } from "@/lib/utils";
import { CheckIcon, CopyIcon, Loader2, PinIcon } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { getStatusBadge } from "./dashboard";
import { Badge } from "@/components/ui/badge";
import { useBanks } from "@/lib/hooks";

const units = [
  "Bible Study",
  "Choir",
  "Drama",
  "Library",
  "Organising",
  "Prayer",
  "Publicity",
  "President",
  "Ushering",
];

const levels = ["100", "200", "300", "400", "500"];

export const paymentStatuses = ["NOT_PAID", "PENDING", "PAID", "PARTIAL"];

export const CreatePaymentForm = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
  } = useForm({
    resolver: zodResolver(PaymentSchema),
    defaultValues: {
      paidAmount: 0.0,
    },
  });
  const outreachQ = useQuery({
    queryKey: ["outreach"],
    queryFn: async () => {
      const response = await fetch(`/api/v1/outreach`);
      return response.json();
    },
  });

  const banksQ = useBanks();

  const createMutation = useMutation({
    mutationFn: (newPayment: any) =>
      fetch("/api/v1/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPayment),
      }),
    onSuccess: () => {
      onClose();
      toast("Success", { description: "Payment created successfully." });
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof PaymentSchema>> = (data) => {
    createMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Payment</DialogTitle>
            <DialogDescription>
              Enter the details for the new payment.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-name" className="text-left">
                Name
              </Label>
              <div className="col-span-3">
                <Input
                  id="new-name"
                  {...register("name")}
                  className={errors?.name ? "border-red-500" : ""}
                />
                {errors?.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors?.name?.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-phone" className="text-left">
                Phone
              </Label>
              <div className="col-span-3">
                <Input
                  id="new-phone"
                  {...register("phone")}
                  className={errors?.phone ? "border-red-500" : ""}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors?.phone?.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-email" className="text-left">
                Email
              </Label>
              <div className="col-span-3">
                <Input
                  id="new-email"
                  type="email"
                  {...register("email")}
                  className={errors?.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors?.email?.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-gender" className="text-left">
                Gender
              </Label>
              <Controller
                name="gender"
                control={control}
                defaultValue="UNSPECIFIED"
                rules={{ required: "Gender is required" }}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                      <SelectItem value="UNSPECIFIED">Select Gender</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-unit" className="text-left">
                Unit (Kindly choose President if it's a non worker)
              </Label>
              <Controller
                name="unit"
                control={control}
                defaultValue="president"
                render={({ field }) => (
                  <Select
                    value={field.value || undefined}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {units?.map((unit, index) => (
                        <SelectItem
                          key={unit}
                          className="capitalize"
                          value={unit}
                        >
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-level" className="text-left">
                Level
              </Label>
              <Controller
                name="level"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value || undefined}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {levels?.map((level, index) => (
                        <SelectItem
                          key={level}
                          className="capitalize"
                          value={level}
                        >
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-amount" className="text-left">
                Amount
              </Label>
              <div className="col-span-3">
                <Input
                  id="new-amount"
                  type="number"
                  step="100"
                  {...register("paidAmount")}
                  className={errors?.paidAmount ? "border-red-500" : ""}
                />
                {errors?.paidAmount && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors?.paidAmount?.message}
                  </p>
                )}
              </div>
            </div>
            <CrewSelect control={control} />

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-status" className="text-left">
                Status
              </Label>
              <Controller
                name="paymentStatus"
                control={control}
                defaultValue="NOT_PAID"
                rules={{ required: "Status is required" }}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentStatuses.map((status) => (
                        <SelectItem
                          className="capitalize"
                          key={status}
                          value={status}
                        >
                          {status.toLowerCase().replace("_", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-left">Outreach</Label>
              <Controller
                name="outreachId"
                control={control}
                rules={{ required: "Outreach is required" }}
                render={({ field }) => (
                  <Select
                    value={field.value || ""}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select outreach" />
                    </SelectTrigger>
                    <SelectContent>
                      {outreachQ?.data?.data?.map(
                        (item: OutreachType, index: number) => (
                          <SelectItem key={index} value={item.id}>
                            {item.theme}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-left">Payment Option</Label>
              <Controller
                name="bankId"
                control={control}
                rules={{ required: "Payment option is required" }}
                render={({ field }) => (
                  <Select
                    value={field.value || ""}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      {banksQ?.data?.data?.map(
                        (item: BankType, index: number) => (
                          <SelectItem key={index} value={item.id}>
                            {item.name} - {item.bank}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "Creating..." : "Create Payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

const STORAGE_KEY = "registration";
export const OutreachRegisterForm = ({
  open,
  onClose,
  outreach,
}: {
  open: boolean;
  onClose: () => void;
  outreach: OutreachType;
}) => {
  const [step, setStep] = useState<number>(1);
  const [copyText, setCopyText] = useState("Copy");

  const [proof, setProof] = useState<boolean>(false);
  const [pendingRegistration, setPendingRegistration] =
    useState<boolean>(false);
  const [payment, setPayment] = useState<PaymentType | null>(null);
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(PaymentSchema),
    defaultValues: {
      paidAmount: 500.0,
      name: "",
      email: "",
      phone: "",
      bankId: "",
      outreachId: "",
      unit: "President",
    },
  });

  const paidAmountState = useWatch({ control, name: "paidAmount" });

  const banksQ = useBanks();

  const handleCopySuccess = () => {
    setCopyText("Copied!");
    setTimeout(() => setCopyText("Copy"), 3000);
  };

  const createMutation = useMutation({
    mutationFn: (newPayment: any) => axios.post("/api/v1/payments", newPayment),
    onSuccess: (data: AxiosResponse<{ data: PaymentType }>) => {
      setPayment(data?.data?.data);
      localStorage.removeItem(STORAGE_KEY);
      toast("Success", { description: "Registered successfully." });
      setStep(3);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast("Error", { description: error.response?.data?.message || "" });
    },
  });

  const handleRegistrationDone = () => {
    toast("Success", {
      description: "Thank you for registering! God bless you.",
    });
    onClose();
    setStep(1);
    reset();
    localStorage.removeItem(STORAGE_KEY);
  };

  const onSubmit: SubmitHandler<z.infer<typeof PaymentSchema>> = (data) => {
    if (payment) {
      setStep(3);
      return;
    }
    createMutation.mutate(data);
  };

  const handleFileUpload = (results: ExtFile[]) => {
    setProof(true);
  };

  useEffect(() => {
    if (outreach?.id) {
      setValue("outreachId", outreach?.id);
    }
  }, [outreach]);

  useEffect(() => {
    if (banksQ?.data?.data?.length) {
      setValue("bankId", banksQ?.data?.data[0].id);
    }
  }, [banksQ?.data?.data?.length]);

  useEffect(() => {
    if (Object.keys(errors).length) {
      setStep(1);
    }
  }, [errors]);

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    let parsedData: z.infer<typeof PaymentSchema> | null = savedData
      ? JSON.parse(savedData)
      : null;
    if (parsedData) {
      setPendingRegistration(true);
      reset({
        ...parsedData,
      });
    }
  }, [reset]);

  useEffect(() => {
    const subscription = watch((data) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className="sm:max-w-[600px] bg-gray-950 max-h-[80vh] overflow-y-auto">
          <DialogHeader className="border-b border-gray-500/30 py-2">
            <DialogTitle>Register For Outreach</DialogTitle>
            <DialogDescription>Step {step} of 3</DialogDescription>
            {pendingRegistration && (
              <DialogDescription>
                You've a pending registration.
              </DialogDescription>
            )}
          </DialogHeader>
          <AnimatePresence mode={"sync"}>
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className={`${step === 1 ? "" : "hidden"}`}
            >
              <div className="flex flex-col gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="new-name" className="text-left">
                    Name <span className="text-red-500">*</span>
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="new-name"
                      {...register("name", { required: "Name is required" })}
                      required
                      className={errors?.name ? "border-red-500" : ""}
                    />
                    {errors?.name && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors?.name?.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="new-phone" className="text-left">
                    Phone <span className="text-red-500">*</span>
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="new-phone"
                      {...register("phone", {
                        required: "Phone number is required.",
                      })}
                      className={errors?.phone ? "border-red-500" : ""}
                      required
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors?.phone?.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="new-email" className="text-left">
                    Email
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="new-email"
                      {...register("email")}
                      className={errors?.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors?.email?.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-row items-center gap-24">
                  <Label htmlFor="new-gender" className="text-left">
                    Gender
                  </Label>
                  <Controller
                    name="gender"
                    control={control}
                    defaultValue="UNSPECIFIED"
                    rules={{ required: "Gender is required" }}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MALE">Male</SelectItem>
                          <SelectItem value="FEMALE">Female</SelectItem>
                          <SelectItem value="UNSPECIFIED">
                            Select Gender
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="flex flex-col items-start gap-4">
                  <Label htmlFor="new-unit" className="text-left leading-5">
                    Unit (Kindly choose President if you are a non worker)
                  </Label>
                  <Controller
                    name="unit"
                    control={control}
                    defaultValue="President"
                    render={({ field }) => (
                      <Select
                        value={field.value || undefined}
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <SelectTrigger className="w-2/4">
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          {units?.map((unit, index) => (
                            <SelectItem
                              key={unit}
                              className="capitalize"
                              value={unit}
                            >
                              {unit}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            </motion.div>
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className={`${step === 2 ? "" : "hidden"}`}
            >
              <div className="flex flex-col gap-8 py-4">
                <div className="flex flex-col gap-4">
                  <Label htmlFor="new-amount" className="text-left">
                    Amount (Fee is NGN{outreach.fee}+X, with a installment
                    minimum of NGN500)
                  </Label>
                  <div className="max-w-2/4">
                    <Input
                      id="new-amount"
                      type="number"
                      step="100"
                      readOnly={!!payment}
                      {...register("paidAmount")}
                      className={errors?.paidAmount ? "border-red-500" : ""}
                    />
                    {errors?.paidAmount && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors?.paidAmount?.message}
                      </p>
                    )}
                  </div>
                </div>
                <CrewSelect label={"Are you in any Crew?"} control={control} />
                <div className="flex flex-col gap-4 w-full">
                  <Label className="text-left">
                    Payment{" "}
                    {(banksQ?.data?.data?.length ?? 0) > 1
                      ? "Options"
                      : "Details"}
                  </Label>
                  {banksQ?.data?.data?.length && (
                    <RadioGroup
                      defaultValue={banksQ?.data?.data[0].id}
                      onValueChange={(v) => setValue("bankId", v)}
                    >
                      {banksQ?.data?.data?.map(
                        (item: BankType, index: number) => (
                          <div
                            key={`bank-${index}`}
                            className="flex flex-row gap-8 items-center"
                          >
                            {banksQ?.data?.data?.length > 1 && (
                              <RadioGroupItem value={item.id} id={item.id} />
                            )}
                            <div className="flex flex-col gap-4 bg-gray-300/10 p-2 rounded-md border-1 border-gray-500 w-full">
                              <div className="flex flex-col gap-2 min-w-32">
                                <p
                                  className={`text-sm text-gray-600 dark:text-gray-400 capitalize`}
                                >
                                  Bank Name
                                </p>
                                <div className="text-black dark:text-white text-base font-bold whitespace-pre-wrap capitalize">
                                  {item.bank}
                                </div>
                              </div>
                              <div className="flex flex-col gap-2 min-w-32">
                                <p
                                  className={`text-sm text-gray-600 dark:text-gray-400 capitalize`}
                                >
                                  Account No.
                                </p>
                                <div className="text-black dark:text-white text-base font-bold whitespace-pre-wrap capitalize">
                                  <div className="flex flex-row items-center gap-12">
                                    {/* <Input
                                      defaultValue={}
                                      readOnly
                                    /> */}
                                    <span className="font-bold text-lg">
                                      {item.acctNo}
                                    </span>
                                    <Button
                                      onClick={() =>
                                        copyToClipboard(
                                          item.acctNo,
                                          handleCopySuccess
                                        )
                                      }
                                      size="sm"
                                      className="px-3"
                                    >
                                      <span className="sr-only">
                                        {copyText}
                                      </span>
                                      <CopyIcon />
                                      {copyText}
                                    </Button>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col gap-2 min-w-32">
                                <p
                                  className={`text-sm text-gray-600 dark:text-gray-400 capitalize`}
                                >
                                  Account Name
                                </p>
                                <div className="text-black dark:text-white text-base font-bold whitespace-pre-wrap capitalize">
                                  {item?.name}
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </RadioGroup>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div
              key="step3"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className={`flex flex-col gap-4 ${step === 3 ? "" : "hidden"}`}
            >
              {payment && (
                <>
                  <Label>Kindly Upload Proof of Payment</Label>
                  <FileUpload
                    uploadUrl={`/api/v1/payments/proof?id=${payment?.id}`}
                    onUploadFinish={handleFileUpload}
                  />
                </>
              )}
            </motion.div>
          </AnimatePresence>

          <DialogFooter>
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            )}
            {step == 1 ? (
              <Button onClick={() => setStep(step + 1)}>Next</Button>
            ) : step == 2 ? (
              <Button
                type="submit"
                onClick={handleSubmit(onSubmit)}
                disabled={
                  createMutation.isPending || (paidAmountState ?? 0) < 500
                }
              >
                {createMutation.isPending
                  ? "Registering..."
                  : "I've made the transfer"}
              </Button>
            ) : (
              <Button onClick={handleRegistrationDone} disabled={!proof}>
                Done
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export const UpdatePaymentForm = ({
  payment,
  open,
  onClose,
}: {
  payment: PaymentType;
  open: boolean;
  onClose: () => void;
}) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(PaymentSchema),
    defaultValues: {
      paidAmount: 0.0,
    },
  });
  const paidAmountState = useWatch({ control, name: "paidAmount" });
  const pendingAmountState = useWatch({ control, name: "pendingAmount" });
  const outreachQ = useQuery({
    queryKey: ["outreach"],
    queryFn: async () => {
      const response = await fetch(`/api/v1/outreach`);
      return response.json();
    },
  });
  const banksQ = useBanks();

  const updateMutation = useMutation({
    mutationFn: (newPayment: any) =>
      axios.patch(`/api/v1/payments/update?id=${payment.id}`, newPayment),
    onSuccess: () => {
      onClose();
      toast("Success", {
        description: "Payment updated successfully.",
        className: "dark",
      });
    },
  });

  const handleApprovePending = () => {
    const confirm = window.confirm(
      "Are you sure you want to proceed with approving this pending amount ?"
    );
    if (!confirm) return;

    setValue("paidAmount", (paidAmountState ?? 0) + (pendingAmountState ?? 0));
    setValue("pendingAmount", 0.0);
  };

  const onSubmit: SubmitHandler<z.infer<typeof PaymentSchema>> = (data) => {
    updateMutation.mutate(data);
  };

  useEffect(() => {
    if (payment) {
      reset(payment);
    }
  }, [payment]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className="sm:min-w-[300px] sm:max-w-[40%]">
          <DialogHeader>
            <DialogTitle>Update Payment</DialogTitle>
            <DialogDescription>
              Make changes to the payment details below.
            </DialogDescription>
          </DialogHeader>
          {payment && (
            <div className="flex flex-col gap-4 py-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="payment-id" className="text-left">
                  ID
                </Label>
                <Input
                  id="payment-id"
                  value={payment.id}
                  className="col-span-3"
                  disabled
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="update-name" className="text-left">
                  Name
                </Label>
                <div className="col-span-3">
                  <Input
                    id="update-name"
                    {...register("name")}
                    className={errors?.name ? "border-red-500" : ""}
                  />
                  {errors?.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors?.name?.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="update-phone" className="text-left">
                  Phone
                </Label>
                <div className="col-span-3">
                  <Input
                    id="update-phone"
                    {...register("phone")}
                    className={errors?.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors?.phone?.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="update-email" className="text-left">
                  Email
                </Label>
                <div className="col-span-3">
                  <Input
                    id="update-email"
                    type="email"
                    {...register("email")}
                    className={errors?.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors?.email?.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="update-gender" className="text-left">
                  Gender
                </Label>
                <Controller
                  name="gender"
                  control={control}
                  defaultValue="UNSPECIFIED"
                  rules={{ required: "Gender is required" }}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                        <SelectItem value="UNSPECIFIED">
                          Select Gender
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-unit" className="text-left">
                  Unit (Kindly choose President if it's a non worker)
                </Label>
                <Controller
                  name="unit"
                  control={control}
                  defaultValue="president"
                  render={({ field }) => (
                    <Select
                      value={field.value || undefined}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {units?.map((unit, index) => (
                          <SelectItem
                            key={unit}
                            className="capitalize"
                            value={unit}
                          >
                            {unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              {!!pendingAmountState && (
                <div className="flex flex-row gap-2 items-center">
                  <Badge
                    variant={"outline"}
                    className="bg-amber-500 p-3 font-bold"
                  >
                    <PinIcon />
                    Pending Amount: NGN{payment?.pendingAmount}
                  </Badge>
                  <Button
                    // size={"icon"}
                    variant={"outline"}
                    onClick={handleApprovePending}
                    className="bg-green-500/30 rounded-full border-gray-300"
                  >
                    <CheckIcon className="text-white" />
                    Approve
                  </Button>
                </div>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="update-amount" className="text-left">
                  Paid Amount (NGN)
                </Label>
                <div className="col-span-3">
                  <Input
                    id="update-amount"
                    type="number"
                    step="0.01"
                    {...register("paidAmount")}
                    className={errors?.paidAmount ? "border-red-500" : ""}
                  />
                  {errors?.paidAmount && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors?.paidAmount?.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-crew" className="text-left">
                  Crew
                </Label>
                <Controller
                  name="crew"
                  control={control}
                  defaultValue="nocrew"
                  rules={{ required: "Crew is required" }}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select crew" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nocrew">No Crew</SelectItem>
                        <SelectItem value="kitchen">Kitchen Crew</SelectItem>
                        <SelectItem value="technical">
                          Technical Crew
                        </SelectItem>
                        <SelectItem value="logistics">
                          Logistics Crew
                        </SelectItem>
                        <SelectItem value="security">Security Crew</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="update-status" className="text-left">
                  Status
                </Label>
                <Controller
                  name="paymentStatus"
                  control={control}
                  defaultValue="NOT_PAID"
                  rules={{ required: "Status is required" }}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentStatuses.map((status) => (
                          <SelectItem
                            className="capitalize"
                            key={status}
                            value={status}
                          >
                            {status.toLowerCase().replace("_", " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-left">Outreach</Label>
                <Controller
                  name="outreachId"
                  control={control}
                  rules={{ required: "Outreach is required" }}
                  render={({ field }) => (
                    <Select
                      value={field.value || ""}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select outreach" />
                      </SelectTrigger>
                      <SelectContent>
                        {outreachQ?.data?.data?.map(
                          (item: OutreachType, index: number) => (
                            <SelectItem key={index} value={item.id}>
                              {item.theme}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-left">Payment Option</Label>
                <Controller
                  name="bankId"
                  control={control}
                  rules={{ required: "Payment option is required" }}
                  render={({ field }) => (
                    <Select
                      value={field.value || ""}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        {banksQ?.data?.data.map(
                          (item: BankType, index: number) => (
                            <SelectItem key={index} value={item.id}>
                              {item.name} - {item.bank}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="flex flex-col gap-2">
                <p>Proof of Payment(s)</p>
                {payment.proof_image ? (
                  payment.proof_image?.map((src, index) => (
                    <Zoom key={index}>
                      <CldImage
                        width="360"
                        height="200"
                        src={src}
                        sizes="100vw"
                        className="rounded-lg"
                        alt={`${payment.name}'s Proof of Payment`}
                      />
                    </Zoom>
                  ))
                ) : (
                  <span className="italic text-gray-500">No uploads...</span>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export const PaymentTopupForm = ({
  open,
  onClose,
  outreachId,
}: {
  open: boolean;
  onClose: () => void;
  outreachId: string;
}) => {
  const [step, setStep] = useState<number>(1);
  const [copyText, setCopyText] = useState("Copy");

  const [proof, setProof] = useState<boolean>(false);
  const [notFound, setNotFound] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [payment, setPayment] = useState<PaymentType | null>(null);
  const [query, setQuery] = useState<string>("");
  const [amount, setAmount] = useState<number>(500);

  const banksQ = useBanks();

  const handleCopySuccess = () => {
    setCopyText("Copied!");
    setTimeout(() => setCopyText("Copy"), 3000);
  };

  const updateMutation = useMutation({
    mutationFn: (newPayment: any) =>
      axios.patch(`/api/v1/payments/update?id=${payment?.id}`, newPayment),
    onSuccess: () => {
      setStep(3);
      toast("Success", {
        description: "Payment updated successfully.",
        className: "dark",
      });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast("Error", { description: error?.response?.data?.message });
    },
  });

  const onSubmit = () => {
    updateMutation.mutate({ pendingAmount: amount });
  };

  const fetchPayment = async () => {
    setIsLoading(true);
    setNotFound(false);
    try {
      const response = await axios.get(
        `/api/v1/payments/search?q=${query}&outreachId=${outreachId}`
      );
      setPayment(response.data?.data);
      setIsLoading(false);
    } catch (error) {
      setNotFound(true);
      setIsLoading(false);
    }
  };

  const handleFileUpload = () => {
    setProof(true);
  };

  const handleRegistrationDone = () => {
    toast("Success", {
      description: "Thank you for topping up your payment! God bless you.",
    });
    onClose();
    setStep(1);
    setPayment(null);
    setQuery("");
    setAmount(500);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <form onSubmit={onSubmit}>
        <DialogContent className="sm:max-w-[600px] bg-gray-950 max-h-[80vh] overflow-y-auto">
          <DialogHeader className="border-b border-gray-500/30 py-2">
            <DialogTitle>Payment Top-Up</DialogTitle>
            <DialogDescription>Step {step} of 3</DialogDescription>
          </DialogHeader>
          <AnimatePresence mode={"wait"}>
            {step == 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
              >
                <div className="flex flex-col gap-4 py-4">
                  <div className="flex flex-col items-start gap-4">
                    <Label htmlFor="query" className="text-left">
                      Enter your Phone number or Email address{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="query"
                      onChange={(e) => setQuery(e.target.value)}
                      value={query}
                      placeholder="johndoe@gmail.com"
                      className="max-w-[60%]"
                      required
                    />
                    <Button onClick={fetchPayment} disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Fetching...
                        </>
                      ) : (
                        "Get Previous Payment"
                      )}
                    </Button>
                    {payment && (
                      <div className="flex flex-col gap-4 bg-gray-300/10 p-2 rounded-md border-1 border-gray-500 w-full">
                        <div className="flex flex-col gap-2 min-w-32">
                          <p
                            className={`text-sm text-gray-600 dark:text-gray-400 capitalize`}
                          >
                            Name
                          </p>
                          <div className="text-black dark:text-white text-base font-bold whitespace-pre-wrap capitalize">
                            {payment?.name}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 min-w-32">
                          <p
                            className={`text-sm text-gray-600 dark:text-gray-400 capitalize`}
                          >
                            Payment Status
                          </p>
                          <div className="text-black dark:text-white text-base font-bold whitespace-pre-wrap capitalize">
                            {getStatusBadge(payment?.paymentStatus)}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 min-w-32">
                          <p
                            className={`text-sm text-gray-600 dark:text-gray-400 capitalize`}
                          >
                            Paid Amount
                          </p>
                          <div className="text-black dark:text-white text-base font-bold whitespace-pre-wrap capitalize">
                            NGN{payment?.paidAmount}
                          </div>
                        </div>
                      </div>
                    )}
                    {notFound && (
                      <p className="italic text-gray-500">
                        Sorry, we couldn't find your payment. Confirm your email
                        or phone number and try again
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
              >
                <div className="flex flex-col gap-8 py-4">
                  <div className="flex flex-col gap-4 max-w-2/4">
                    <Label htmlFor="new-amount" className="text-left">
                      Paid Amount (A minimum of NGN500)
                    </Label>
                    <Input
                      type="number"
                      step="100"
                      value={amount}
                      placeholder="500"
                      className="max-w-[60%]"
                      onChange={(e) => setAmount(parseFloat(e.target?.value))}
                    />
                  </div>

                  <div className="flex flex-col gap-4 w-full">
                    <Label className="text-left">
                      Payment{" "}
                      {(banksQ?.data?.data?.length ?? 0) > 1
                        ? "Options"
                        : "Details"}
                    </Label>
                    {banksQ?.isLoading && (
                      <div className="flex flex-row gap-2 items-center">
                        <Loader2 className="mr-2 h-6 w-6 animate-spin" />{" "}
                        Fetching Payment Options...
                      </div>
                    )}
                    {banksQ?.data?.data?.length &&
                      banksQ.data.data?.map((item: BankType, index: number) => (
                        <div
                          key={`bank-${index}`}
                          className="flex flex-row gap-8 items-center"
                        >
                          {(banksQ?.data?.data?.length ?? 0) > 1 && (
                            <RadioGroupItem value={item.id} id={item.id} />
                          )}
                          <div className="flex flex-col gap-4 bg-gray-300/10 p-2 rounded-md border-1 border-gray-500 w-full">
                            <div className="flex flex-col gap-2 min-w-32">
                              <p
                                className={`text-sm text-gray-600 dark:text-gray-400 capitalize`}
                              >
                                Bank Name
                              </p>
                              <div className="text-black dark:text-white text-base font-bold whitespace-pre-wrap capitalize">
                                {item.bank}
                              </div>
                            </div>
                            <div className="flex flex-col gap-2 min-w-32">
                              <p
                                className={`text-sm text-gray-600 dark:text-gray-400 capitalize`}
                              >
                                Account No.
                              </p>
                              <div className="text-black dark:text-white text-base font-bold whitespace-pre-wrap capitalize">
                                <div className="flex flex-row items-center gap-12">
                                  {/* <Input
                                      defaultValue={}
                                      readOnly
                                    /> */}
                                  <span className="font-bold text-lg">
                                    {item.acctNo}
                                  </span>
                                  <Button
                                    onClick={() =>
                                      copyToClipboard(
                                        item.acctNo,
                                        handleCopySuccess
                                      )
                                    }
                                    size="sm"
                                    className="px-3"
                                  >
                                    <span className="sr-only">{copyText}</span>
                                    <CopyIcon />
                                    {copyText}
                                  </Button>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2 min-w-32">
                              <p
                                className={`text-sm text-gray-600 dark:text-gray-400 capitalize`}
                              >
                                Account Name
                              </p>
                              <div className="text-black dark:text-white text-base font-bold whitespace-pre-wrap capitalize">
                                {item?.name}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                className={`flex flex-col gap-4`}
              >
                {payment && (
                  <>
                    <Label>Kindly Upload Proof of Payment</Label>
                    <FileUpload
                      uploadUrl={`/api/v1/payments/proof?id=${payment?.id}`}
                      onUploadFinish={handleFileUpload}
                    />
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          <DialogFooter>
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            )}
            {step == 1 && (
              <Button disabled={!payment} onClick={() => setStep(2)}>
                Next
              </Button>
            )}
            {step == 2 && (
              <Button
                type="submit"
                onClick={onSubmit}
                disabled={updateMutation.isPending || amount < 500}
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "I've made the transfer"
                )}
              </Button>
            )}
            {step == 3 && (
              <Button onClick={handleRegistrationDone} disabled={!proof}>
                Done
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};
