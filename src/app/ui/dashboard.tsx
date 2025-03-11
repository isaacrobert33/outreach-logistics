"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowUpDown,
  DollarSign,
  Download,
  Pencil,
  PlusIcon,
  Search,
  Trash2,
} from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { PaymentType } from "@/lib/types/common";
import { PaymentStatus } from "@prisma/client";
import { toast } from "sonner";
import { CreatePaymentForm, UpdatePaymentForm } from "./payment-form";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AccountMenu from "./account-menu";

export default function Dashboard() {
  const session = useSession();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("*");
  const [selectedPayment, setSelectedPayment] = useState<PaymentType | null>(
    null
  );
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const { data, refetch } = useQuery({
    queryKey: ["payments", statusFilter, searchQuery],
    queryFn: async () => {
      const response = await fetch(
        `/api/v1/payments?q=${searchQuery || "*"}&status=${statusFilter ?? "*"}`
      );
      return response.json();
    },
  });

  const statsQuery = useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const res = await fetch(`/api/v1/payments/stats`);
      return res.json();
    },
  });
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/v1/payments/update?id=${id}`, {
        method: "DELETE",
      });
      return res.json();
    },
    onSuccess: () => {
      toast("Success", { description: "Payment record deleted succesfully." });
      refetch();
      statsQuery.refetch();
    },
  });

  // Open update dialog with selected payment
  const openUpdateDialog = (payment: PaymentType) => {
    setSelectedPayment(payment);
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

  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case "PAID":
        return <Badge className="bg-green-500">Paid</Badge>;
      case "PENDING":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "NOT_PAID":
        return <Badge className="bg-red-500">Not Paid</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push(`/`);
    }
  }, [session]);

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold md:hidden flex items-center gap-2">
          <DollarSign className="h-6 w-6" />
          <span>Outreach</span>
        </h1>
        <div className="flex items-center ml-auto">
          <Button variant="outline" size="lg" className="mr-2">
            <Download className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button
            size="lg"
            onClick={openCreateDialog}
            className="cursor-pointer"
          >
            <PlusIcon className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">New Payment</span>
          </Button>

          <AccountMenu />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Payment Records</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Manage and track all payment transactions
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                NGN{statsQuery?.data?.data?.totalPaidAmount}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Across {data?.data?.length} transactions
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Completed Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                NGN{statsQuery?.data?.data?.completedPaidAmount}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {statsQuery?.data?.data?.totalPaid} payments
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">
                NGN{statsQuery?.data?.data?.pendingPaidAmount}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {statsQuery?.data?.data?.totalPending} payments
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search payments..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="*">All Statuses</SelectItem>
                  <SelectItem value="PAID">Paid</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="NOT_PAID">Not Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Payments Table */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Payment Records</CardTitle>
            <CardDescription>
              {data?.data?.length} payments found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Crew</TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        Paid Amount
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead>Status</TableHead>
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
                        No payments found. Try adjusting your filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    data?.data?.map((payment: PaymentType) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">
                          {payment.id}
                        </TableCell>
                        <TableCell>
                          <div>
                            {payment.name}
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {payment.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="capitalize">
                          {payment.crew}
                        </TableCell>
                        <TableCell>
                          NGN{payment.paidAmount?.toFixed(2)}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {payment.createdAt}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(payment.paymentStatus || "NOT_PAID")}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openUpdateDialog(payment)}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(payment.id)}
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
          <UpdatePaymentForm
            open={isUpdateDialogOpen}
            onClose={() => {
              setIsUpdateDialogOpen(false);
              refetch();
              statsQuery.refetch();
            }}
            payment={selectedPayment}
          />
        )}

        {/* New Payment Dialog */}
        {isNewDialogOpen && (
          <CreatePaymentForm
            open={isNewDialogOpen}
            onClose={() => {
              setIsNewDialogOpen(false);
              refetch();
              statsQuery.refetch();
            }}
          />
        )}
      </main>
    </div>
  );
}
