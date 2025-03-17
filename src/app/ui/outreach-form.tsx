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
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { OutreachType } from "@/lib/types/common";
import { useEffect } from "react";
import { toast } from "sonner";
import { OutreachSchema } from "@/lib/schema";

export const CreateOutreachForm = ({
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
    resolver: zodResolver(OutreachSchema),
  });
  const createMutation = useMutation({
    mutationFn: (newOutreach: any) =>
      fetch("/api/v1/outreach", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newOutreach),
      }),
    onSuccess: () => {
      onClose();
      toast("Success", { description: "Outreach created successfully." });
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof OutreachSchema>> = (data) => {
    createMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Outreach</DialogTitle>
            <DialogDescription>
              Enter the details for the new outreach.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-theme" className="text-right">
                Outreach Theme
              </Label>
              <div className="col-span-3">
                <Input
                  id="new-theme"
                  {...register("theme")}
                  className={errors?.theme ? "border-red-500" : ""}
                />
                {errors.theme && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors?.theme?.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-description" className="text-right">
                Description
              </Label>
              <div className="col-span-3">
                <Input
                  id="new-description"
                  {...register("description")}
                  className={errors?.description ? "border-red-500" : ""}
                />
                {errors?.description && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors?.description?.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-location" className="text-right">
                Event Location
              </Label>
              <div className="col-span-3">
                <Input
                  id="new-location"
                  {...register("location")}
                  className={errors?.location ? "border-red-500" : ""}
                />
                {errors?.location && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors?.location?.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-date" className="text-right">
                Event Date
              </Label>
              <div className="col-span-3">
                <Input
                  id="new-date"
                  {...register("date")}
                  className={errors?.date ? "border-red-500" : ""}
                />
                {errors?.location && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors?.date?.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="update-amount" className="text-left">
                Outreach Fee (NGN)
              </Label>
              <div className="col-span-3">
                <Input
                  id="fee"
                  type="number"
                  step="0.01"
                  {...register("fee")}
                  className={errors?.fee ? "border-red-500" : ""}
                />
                {errors?.fee && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors?.fee?.message}
                  </p>
                )}
              </div>
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
              {createMutation.isPending ? "Creating..." : "Create Outreach"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export const UpdateOutreachForm = ({
  outreach,
  open,
  onClose,
}: {
  outreach: OutreachType;
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
    resolver: zodResolver(OutreachSchema),
  });
  const updateMutation = useMutation({
    mutationFn: (newOutreach: any) =>
      fetch(`/api/v1/outreach/${outreach.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newOutreach),
      }),
    onSuccess: () => {
      onClose();
      toast("Success", {
        description: "Outreach updated successfully.",
        className: "dark",
      });
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof OutreachSchema>> = (data) => {
    updateMutation.mutate(data);
  };

  useEffect(() => {
    if (outreach) {
      reset(outreach);
    }
  }, [outreach]);
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Outreach</DialogTitle>
            <DialogDescription>
              Make changes to the outreach details below.
            </DialogDescription>
          </DialogHeader>
          {outreach && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="update-theme" className="text-right">
                  Outreach Theme
                </Label>
                <div className="col-span-3">
                  <Input
                    id="update-theme"
                    {...register("theme")}
                    className={errors?.theme ? "border-red-500" : ""}
                  />
                  {errors.theme && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors?.theme?.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="update-description" className="text-right">
                  Description
                </Label>
                <div className="col-span-3">
                  <Input
                    id="update-description"
                    {...register("description")}
                    className={errors?.description ? "border-red-500" : ""}
                  />
                  {errors?.description && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors?.description?.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="update-location" className="text-right">
                  Event Location
                </Label>
                <div className="col-span-3">
                  <Input
                    id="update-location"
                    {...register("location")}
                    className={errors?.location ? "border-red-500" : ""}
                  />
                  {errors?.location && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors?.location?.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="update-date" className="text-right">
                  Event Date
                </Label>
                <div className="col-span-3">
                  <Input
                    id="update-date"
                    {...register("date")}
                    className={errors?.date ? "border-red-500" : ""}
                  />
                  {errors?.location && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors?.date?.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="update-amount" className="text-left">
                  Outreach Fee (NGN)
                </Label>
                <div className="col-span-3">
                  <Input
                    id="fee"
                    type="number"
                    step="0.01"
                    {...register("fee")}
                    className={errors?.fee ? "border-red-500" : ""}
                  />
                  {errors?.fee && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors?.fee?.message}
                    </p>
                  )}
                </div>
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
