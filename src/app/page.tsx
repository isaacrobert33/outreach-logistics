"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { LoginForm } from "./ui/login-form";
import { SignupForm } from "./ui/signup-form";

export default function Auth() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status, data } = useSession();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [isLoading, setIsLoading] = useState<{
    google: boolean;
    // github: boolean;
  }>({
    google: false,
    // github: false,
  });

  useEffect(() => {
    // If the user is already authenticated, redirect to dashboard
    if (status === "authenticated") {
      router.push("/dashboard");
    }

    // Check if there's an error from the callback
    const error = searchParams.get("error");
    if (error) {
      console.error("Authentication error:", error);
    }

    // Set active tab based on URL parameter
    const callbackUrl = searchParams.get("callbackUrl");
    if (callbackUrl?.includes("signup")) {
      setActiveTab("signup");
    }
  }, [status, router, searchParams]);

  const handleSocialSignIn = async (provider: "google" | "github") => {
    try {
      setIsLoading({ ...isLoading, [provider]: true });
      await signIn(provider, { callbackUrl: "/dashboard" });
    } catch (error) {
      console.error(`Error signing in with ${provider}:`, error);
    } finally {
      setIsLoading({ ...isLoading, [provider]: false });
    }
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2 items-center">
        <p className="text-3xl font-bold">Outreach</p>
        <p className="text-lg text-gray-500">Logistics Management</p>
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Welcome
          </CardTitle>
          <CardDescription className="text-center">
            Sign in to your account or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue={activeTab}
            onValueChange={(value) => setActiveTab(value as "login" | "signup")}
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm />
            </TabsContent>
            <TabsContent value="signup">
              <SignupForm />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <Button
              variant="outline"
              onClick={() => handleSocialSignIn("google")}
              disabled={isLoading.google}
              className="flex items-center justify-center gap-2 w-full"
              size={"lg"}
            >
              {isLoading.google ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                    <path d="M1 1h22v22H1z" fill="none" />
                  </svg>
                  Google
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
