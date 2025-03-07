"use client";

import { Button } from "@/components/ui/button";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { PaymentType } from "@/lib/types/common";
import { useEffect } from "react";
import { toast } from "sonner";
import { PaymentSchema } from "@/lib/schema";

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
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-name" className="text-right">
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
              <Label htmlFor="new-email" className="text-right">
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
              <Label htmlFor="new-amount" className="text-right">
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
            {/* <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-date" className="text-right">
                Date
              </Label>
              <div className="col-span-3">
                <Input
                  id="new-date"
                  type="date"
                  {...register("createdAt")}
                  className={errors?.createdAt ? "border-red-500" : ""}
                />
                {errors.createdAt && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.createdAt?.message}
                  </p>
                )}
              </div>
            </div> */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-crew" className="text-right">
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
                      <SelectItem value="technical">Technical Crew</SelectItem>
                      <SelectItem value="logistics">Logistics Crew</SelectItem>
                      <SelectItem value="security">Security Crew</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-status" className="text-right">
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
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="payment-id" className="text-right">
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
                <Label htmlFor="update-name" className="text-right">
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
                <Label htmlFor="update-email" className="text-right">
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
                <Label htmlFor="update-amount" className="text-right">
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
                <Label htmlFor="new-crew" className="text-right">
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
                <Label htmlFor="update-status" className="text-right">
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
