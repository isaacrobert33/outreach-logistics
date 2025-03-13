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
import axios, { AxiosResponse } from "axios";
import { ExtFile } from "@files-ui/react";
import CrewSelect from "@/components/crews-select";
import { copyToClipboard } from "@/lib/utils";
import { CopyIcon } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

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

  const banksQ = useQuery({
    queryKey: ["banks"],
    queryFn: async () => {
      const response = await fetch(`/api/v1/banks?isPublic=true`);
      return response.json();
    },
  });
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
                      <SelectItem value="PAID">Paid</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="NOT_PAID">Not Paid</SelectItem>
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
  outreachId,
}: {
  open: boolean;
  onClose: () => void;
  outreachId: string;
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
      paidAmount: 0.0,
      name: "",
      email: "",
      phone: "",
      bankId: "",
      outreachId: "",
    },
  });

  const banksQ = useQuery({
    queryKey: ["banks"],
    queryFn: async () => (await fetch(`/api/v1/banks?isPublic=true`)).json(),
  });

  const handleCopySuccess = () => {
    setCopyText("Copied!");
    setTimeout(() => setCopyText("Copy"), 3000);
  };

  const createMutation = useMutation({
    mutationFn: (newPayment: any) => axios.post("/api/v1/payments", newPayment),
    onSuccess: (data: AxiosResponse<{ data: PaymentType }>) => {
      localStorage.removeItem(STORAGE_KEY);
      setPayment(data?.data?.data);
      toast("Success", { description: "Registered successfully." });
      setStep(3);
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
    createMutation.mutate(data);
  };

  const handleFileUpload = (results: ExtFile[]) => {
    setProof(true);
  };

  useEffect(() => {
    if (outreachId) {
      setValue("outreachId", outreachId);
    }
  }, [outreachId]);

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
                <div className="flex flex-col gap-4 max-w-2/4">
                  <Label htmlFor="new-amount" className="text-left">
                    Paid Amount
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
                <CrewSelect label={"Are you in any Crew?"} control={control} />
                <div className="flex flex-col gap-4 w-full">
                  <Label className="text-left">
                    Payment{" "}
                    {banksQ?.data?.data?.length > 1 ? "Options" : "Details"}
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
              <Label>Kindly Upload Proof of Payment</Label>
              <FileUpload
                uploadUrl={`/api/v1/payments/proof?id=${payment?.id}`}
                onUploadFinish={handleFileUpload}
              />
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
                disabled={createMutation.isPending}
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
    reset,
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
  const banksQ = useQuery({
    queryKey: ["banks"],
    queryFn: async () => {
      const response = await fetch(`/api/v1/banks?isPublic=true`);
      return response.json();
    },
  });
  const updateMutation = useMutation({
    mutationFn: (newPayment: any) =>
      fetch(`/api/v1/payments/update?id=${payment.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPayment),
      }),
    onSuccess: () => {
      onClose();
      toast("Success", {
        description: "Payment updated successfully.",
        className: "dark",
      });
    },
  });

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
        <DialogContent>
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
                <Label htmlFor="update-amount" className="text-left">
                  Amount
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
                        <SelectItem value="PAID">Paid</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="NOT_PAID">Not Paid</SelectItem>
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

              <div className="flex flex-col gap-2">
                <p>Proof of Payment</p>
                {payment.proof_image ? (
                  <Zoom>
                    <CldImage
                      width="360"
                      height="200"
                      src={payment.proof_image}
                      sizes="100vw"
                      alt={`${payment.name}'s Proof of Payment`}
                    />
                  </Zoom>
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
