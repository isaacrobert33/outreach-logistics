"use client";

import { ReactNode, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DollarSign, Pencil, PlusIcon, Trash2 } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { OutreachType } from "@/lib/types/common";
import { toast } from "sonner";
import { CreateOutreachForm, UpdateOutreachForm } from "./outreach-form";
import AccountMenu from "./account-menu";
import { OutreachShare } from "./outreach/share";

export default function Outreachs() {
  const [selectedPayment, setSelectedPayment] = useState<OutreachType | null>(
    null,
  );
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const { data, refetch } = useQuery({
    queryKey: ["outreach"],
    queryFn: async () => {
      const response = await fetch(`/api/v1/outreach`);
      return response.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/v1/outreach/${id}`, {
        method: "DELETE",
      });
      return res.json();
    },
    onSuccess: () => {
      toast("Success", { description: "Outreach deleted succesfully." });
      refetch();
    },
  });

  // Open update dialog with selected outreach
  const openUpdateDialog = (outreach: OutreachType) => {
    setSelectedPayment(outreach);
    setIsUpdateDialogOpen(true);
  };

  const openCreateDialog = () => {
    setIsNewDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const confirm = window.confirm(
      `Are you sure you want to delete this record?`,
    );
    if (!confirm) return;
    deleteMutation.mutate(id);
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <header className="bg-gray-950 border-b dark:border-gray-600/30 p-4 flex items-center justify-between">
        {/* <h1 className="text-xl font-bold md:hidden flex items-center gap-2">
          <DollarSign className="h-6 w-6" />
          <span>Outreach</span>
        </h1> */}
        <div className="flex items-center ml-auto">
          <Button
            size="lg"
            onClick={openCreateDialog}
            className="cursor-pointer">
            <PlusIcon className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Add Outreach</span>
          </Button>
          <AccountMenu />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Outreach Records(s)</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Manage outreach records
          </p>
        </div>

        {/* Outreachs Table */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Outreach Record(s)</CardTitle>
            <CardDescription>
              {data?.data?.length} outreach records found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Outreach Theme</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Event Date</TableHead>
                    <TableHead>Outreach Fee</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data?.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-gray-500 dark:text-gray-400">
                        No outreachs found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    data?.data?.map((outreach: OutreachType) => (
                      <TableRow key={outreach.id}>
                        <TableCell>
                          <div>{outreach.theme}</div>
                        </TableCell>
                        <TableCell className="capitalize">
                          {outreach.description}
                        </TableCell>
                        <TableCell className="capitalize">
                          {outreach.location}
                        </TableCell>
                        <TableCell className="capitalize">
                          {outreach.date}
                        </TableCell>
                        <TableCell className="capitalize">
                          NGN {outreach.fee}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {outreach.createdAt}
                        </TableCell>
                        <TableCell className="text-right">
                          {/* <OutreachShare outreach={outreach} /> */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openUpdateDialog(outreach)}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(outreach.id)} disabled>
                            <Trash2 className="h-4 w-4 text-red-500" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        {/* Update Payment Dialog */}
        {selectedPayment && (
          <UpdateOutreachForm
            open={isUpdateDialogOpen}
            onClose={() => {
              setIsUpdateDialogOpen(false);
              refetch();
            }}
            outreach={selectedPayment}
          />
        )}

        {/* New Payment Dialog */}
        {isNewDialogOpen && (
          <CreateOutreachForm
            open={isNewDialogOpen}
            onClose={() => {
              setIsNewDialogOpen(false);
              refetch();
            }}
          />
        )}
      </main>
    </div>
  );
}
