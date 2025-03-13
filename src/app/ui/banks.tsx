"use client";

import { ReactNode, useEffect, useState } from "react";
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
import { Pencil, PlusIcon, Trash2 } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { BankType } from "@/lib/types/common";
import { toast } from "sonner";
import { CreateBankForm, UpdateBankForm } from "./bank-form";
import AccountMenu from "./account-menu";

export default function Banks() {
  const [selectedPayment, setSelectedPayment] = useState<BankType | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const { data, refetch } = useQuery({
    queryKey: ["banks"],
    queryFn: async () => {
      const response = await fetch(`/api/v1/banks`);
      return response.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/v1/banks/${id}`, {
        method: "DELETE",
      });
      return res.json();
    },
    onSuccess: () => {
      toast("Success", { description: "Account deleted succesfully." });
      refetch();
    },
  });

  // Open update dialog with selected bank
  const openUpdateDialog = (bank: BankType) => {
    setSelectedPayment(bank);
    setIsUpdateDialogOpen(true);
  };

  const openCreateDialog = () => {
    setIsNewDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const confirm = window.confirm(
      `Are you sure you want to delete this record?`
    );
    if (!confirm) return;
    deleteMutation.mutate(id);
  };

  const getPublicBadge = (status: boolean): ReactNode => {
    return status ? (
      <Badge className="bg-green-500">Public</Badge>
    ) : (
      <Badge className="bg-amber-600">Not Public</Badge>
    );
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
            className="cursor-pointer"
          >
            <PlusIcon className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Add Bank</span>
          </Button>
          <AccountMenu />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Payment Options</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Manage bank accounts
          </p>
        </div>

        {/* Banks Table */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Bank Accounts</CardTitle>
            <CardDescription>
              {data?.data?.length} accounts found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Acct. Name</TableHead>
                    <TableHead>Acct. No.</TableHead>
                    <TableHead>Bank Name</TableHead>
                    <TableHead>Public Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data?.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-gray-500 dark:text-gray-400"
                      >
                        No banks found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    data?.data?.map((bank: BankType) => (
                      <TableRow key={bank.id}>
                        <TableCell>
                          <div>{bank.name}</div>
                        </TableCell>
                        <TableCell className="capitalize">
                          {bank.acctNo}
                        </TableCell>
                        <TableCell>{bank.bank}</TableCell>
                        <TableCell>
                          {getPublicBadge(bank.isPublic || false)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openUpdateDialog(bank)}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(bank.id)}
                          >
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
          <UpdateBankForm
            open={isUpdateDialogOpen}
            onClose={() => {
              setIsUpdateDialogOpen(false);
              refetch();
            }}
            bank={selectedPayment}
          />
        )}

        {/* New Payment Dialog */}
        {isNewDialogOpen && (
          <CreateBankForm
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
