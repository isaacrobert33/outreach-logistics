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
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { BankType, OutreachType } from "@/lib/types/common";
import { useEffect } from "react";
import { toast } from "sonner";
import { BankSchema } from "@/lib/schema";
import { Switch } from "@/components/ui/switch";

export const CreateBankForm = ({
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
    resolver: zodResolver(BankSchema),
    defaultValues: {
      isPublic: true,
    },
  });
  const outreachQ = useQuery({
    queryKey: ["outreach"],
    queryFn: async () => {
      const response = await fetch(`/api/v1/outreach`);
      return response.json();
    },
  });
  const createMutation = useMutation({
    mutationFn: (newBank: any) =>
      fetch("/api/v1/banks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBank),
      }),
    onSuccess: () => {
      onClose();
      toast("Success", { description: "Bank created successfully." });
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof BankSchema>> = (data) => {
    createMutation.mutate(data);
  };

  console.log(errors);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Bank</DialogTitle>
            <DialogDescription>
              Enter the details for the new bank.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-name" className="text-right">
                Acct. Name
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
              <Label htmlFor="new-bank" className="text-right">
                Bank Name
              </Label>
              <div className="col-span-3">
                <Input
                  id="new-bank"
                  {...register("bank")}
                  className={errors?.bank ? "border-red-500" : ""}
                  placeholder="Guaranty Trust Bank"
                />
                {errors.bank && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors?.bank?.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-acct-no" className="text-right">
                Acct. No.
              </Label>
              <div className="col-span-3">
                <Input
                  id="new-acct-no"
                  type="number"
                  step="100"
                  {...register("acctNo")}
                  className={errors?.acctNo ? "border-red-500" : ""}
                />
                {errors?.acctNo && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors?.acctNo?.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-col-2 items-center gap-4">
              <Controller
                name="isPublic"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="public-mode"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <Label htmlFor="public-mode">Public</Label>
                  </div>
                )}
              />

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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "Creating..." : "Create Bank"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export const UpdateBankForm = ({
  bank,
  open,
  onClose,
}: {
  bank: BankType;
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
    resolver: zodResolver(BankSchema),
  });
  const outreachQ = useQuery({
    queryKey: ["outreach"],
    queryFn: async () => {
      const response = await fetch(`/api/v1/outreach`);
      return response.json();
    },
  });
  const updateMutation = useMutation({
    mutationFn: (newBank: any) =>
      fetch(`/api/v1/banks/${bank.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBank),
      }),
    onSuccess: () => {
      onClose();
      toast("Success", {
        description: "Bank updated successfully.",
        className: "dark",
      });
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof BankSchema>> = (data) => {
    updateMutation.mutate(data);
  };

  useEffect(() => {
    if (bank) {
      reset(bank);
    }
  }, [bank]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Bank</DialogTitle>
            <DialogDescription>
              Make changes to the bank details below.
            </DialogDescription>
          </DialogHeader>
          {bank && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="bank-id" className="text-right">
                  ID
                </Label>
                <Input
                  id="bank-id"
                  value={bank.id}
                  className="col-span-3"
                  disabled
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-name" className="text-right">
                  Acct. Name
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
                  Bank Name
                </Label>
                <div className="col-span-3">
                  <Input
                    id="new-bank"
                    {...register("bank")}
                    className={errors?.bank ? "border-red-500" : ""}
                  />
                  {errors.bank && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors?.bank?.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-acct-no" className="text-right">
                  Acct. No.
                </Label>
                <div className="col-span-3">
                  <Input
                    id="new-acct-no"
                    type="number"
                    step="100"
                    {...register("acctNo")}
                    className={errors?.acctNo ? "border-red-500" : ""}
                  />
                  {errors?.acctNo && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors?.acctNo?.message}
                    </p>
                  )}
                </div>
              </div>

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
