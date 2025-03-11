"use client";

import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { BanknoteIcon, CreditCard, GridIcon, LogsIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const DashboardLayout = ({ children }: { children: any }) => {
  const router = useRouter();
  const session = useSession();
  const pathname = usePathname();

  const profileQuery = useQuery({
    queryKey: ["profile", session],
    queryFn: async () => {
      const res = await fetch(`/api/v1/users/${session?.data?.user?.email}`);
      return res.json();
    },
    enabled: !!session?.data?.user?.email,
  });

  const handleLogout = () => {
    signOut();
    router.push(`/`);
  };

  useEffect(() => {
    if (session.status === "unauthenticated") {
      handleLogout();
    }
  }, [session]);

  useEffect(() => {
    if (profileQuery.isError) {
      toast("Error", {
        description: "Oops, you don't have access to this resources.",
      });
      handleLogout();
    }
  }, [profileQuery.isError]);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700">
        <div className="p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <LogsIcon className="h-6 w-6" />
            <span>Outreach</span>
          </h2>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            <li>
              <Link href={"/dashboard"}>
                <Button
                  variant={pathname === "/dashboard" ? "link" : "ghost"}
                  className="w-full justify-start"
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Payments
                </Button>
              </Link>
            </li>
            <li>
              <Link href={"/dashboard/outreach"}>
                <Button
                  variant={
                    pathname === "/dashboard/outreach" ? "link" : "ghost"
                  }
                  className="w-full justify-start"
                >
                  <GridIcon className="mr-2 h-4 w-4" />
                  Outreach
                </Button>
              </Link>
            </li>
            <li>
              <Link href={"/dashboard/banks"}>
                <Button
                  variant={pathname === "/dashboard/banks" ? "link" : "ghost"}
                  className="w-full justify-start"
                >
                  <BanknoteIcon className="mr-2 h-4 w-4" />
                  Payment Options
                </Button>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      {children}
    </div>
  );
};

export default DashboardLayout;
