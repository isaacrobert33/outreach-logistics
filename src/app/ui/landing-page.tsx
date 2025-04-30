"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import AOS from "aos";
import "aos/dist/aos.css";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  ArrowRight,
  Heart,
  Loader2,
  PinIcon,
  LandmarkIcon,
  SquareUserIcon,
  Info,
  PlusIcon,
  AlertOctagon,
} from "lucide-react";
import {
  SiFacebook,
  SiX,
  SiInstagram,
  SiYoutube,
  SiWhatsapp,
} from "@icons-pack/react-simple-icons";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BankType, OutreachType } from "@/lib/types/common";
import { OutreachRegisterForm, PaymentTopupForm } from "./payment-form";
import { useBanks } from "@/lib/hooks";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function LandingPage() {
  const [registerDialog, setRegisterDialog] = useState<boolean>(false);
  const [topupDialog, setTopupDialog] = useState<boolean>(false);
  const [bank, setBank] = useState<BankType | null>(null);
  const { data, isLoading } = useQuery({
    queryKey: ["latestOutreach"],
    queryFn: () => axios.get<{ data: OutreachType }>(`/api/v1/outreach/latest`),
  });

  const banksQ = useBanks();

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      mirror: true,
    });
  }, []);

  useEffect(() => {
    if (banksQ?.data?.data?.length) {
      setBank(banksQ?.data?.data[0]);
    }
  }, [banksQ, setBank]);

  return isLoading || banksQ?.isLoading ? (
    <div className="flex flex-col gap-9 items-center justify-center w-full min-h-screen p-8">
      <Loader2 className="mr-2 h-6 w-6 animate-spin" />
      Fetching Outreach information, please wait...
    </div>
  ) : (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      {/* Navigation */}
      <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/80">
        <div className="flex h-16 items-center justify-between px-4 md:px-6 w-full">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">{data?.data?.data?.theme}</span>
          </Link>
          {/* <nav className="hidden md:flex gap-6">
            <Link
              href="#about"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              About
            </Link>
            <Link
              href="#features"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Features
            </Link>
            <Link
              href="#event"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Event
            </Link>
            <Link
              href="#speakers"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Speakers
            </Link>
            <Link
              href="#register"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Register
            </Link>
          </nav> */}
          <Button
            className="hidden md:flex"
            onClick={() => setRegisterDialog(true)}
          >
            Register Now
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10 dark:from-primary/5 dark:to-purple-500/5" />
        <div className="container px-4 md:px-6 relative">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div data-aos="fade-right">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Join The Outreach Event
              </h1>
              <p className="mt-4 text-gray-500 dark:text-gray-400 md:text-xl">
                {data?.data?.data?.description}
              </p>
              <div className="mt-8 grid gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Date</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      {data?.data?.data?.date || "Anticipate"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-2 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Location</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      {data?.data?.data?.location || "Anticipate"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center">
                <Button
                  size="lg"
                  className="font-medium bg-gray-500"
                  onClick={() => setRegisterDialog(true)}
                  disabled
                >
                  Register Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                {/* <Button size="lg" variant="outline" className="font-medium">
                  Learn More
                </Button> */}
              </div>
              <div className="flex flex-row gap-3 items-start sm:items-center mt-12 text-gray-500 dark:text-gray-400 text-sm">
                <Info className="w-8 h-8 sm:w-4 sm:h-4" />
                Or if you have an existing payment record, click below to top-up
                or complete your payment.
              </div>

              <Button
                className="mt-4 md:flex bg-gray-600 hover:bg-green-500"
                onClick={() => setTopupDialog(true)}
                  size={"lg"}
                  disabled
              >
                Top-Up Now
                <PlusIcon className="ml-2 h-4 w-4" />
                </Button>
                <p className="flex flex-row items-center gap-2"><AlertOctagon className="w-5"/>Registrations are closed, see you next year!</p>
            </div>
            <div
              className="mx-auto lg:mx-0 relative"
              data-aos="fade-left"
              data-aos-delay="200"
            >
              <div className="absolute -inset-4 rounded-xl bg-gradient-to-r from-primary/20 to-purple-500/20 blur-xl" />
              <Image
                src="/outreach.jpeg"
                alt="Event Image"
                width={600}
                height={750}
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover opacity-45 h-[20rem]"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0" />
        <div className="container px-4 md:px-6 relative">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-28 items-center">
            <div
              className="mx-auto lg:mx-0 relative hidden sm:block"
              data-aos="fade-right"
              data-aos-delay="200"
            >
              <div className="absolute -inset-4 rounded-xl bg-gradient-to-r from-primary/20 to-purple-500/20 blur-xl" />
              <Image
                src="/donation.jpg"
                alt="Donation Image"
                width={450}
                height={450}
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover opacity-45"
              />
            </div>
            <div data-aos="fade-left">
              <h1 className="text-2xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-4xl">
                For Donations & Support
              </h1>
              <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm md:text-lg">
                God bless you as you do!
              </p>
              {bank && (
                <div className="mt-8 grid gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-2 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <PinIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Acct. No:</h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        {bank?.acctNo}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-2 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <LandmarkIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Bank Name</h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        {bank?.bank}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-2 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <SquareUserIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Acct. Name</h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        {bank?.name}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div
              className="mx-auto lg:mx-0 relative sm:hidden"
              data-aos="fade-right"
              data-aos-delay="200"
            >
              <div className="absolute -inset-4 rounded-xl bg-gradient-to-r from-primary/20 to-purple-500/20 blur-xl" />
              <Image
                src="/donation.jpg"
                alt="Donation Image"
                width={450}
                height={450}
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover opacity-45"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white dark:bg-gray-950 dark:border-gray-800 mt-[8%]">
        <div className="container px-4 md:px-6 py-12">
          <div className="flex sm:flex-row flex-col justify-between w-full gap-16">
            <div className="space-y-4 sm:max-w-[40%]">
              <div className="flex items-center gap-2">
                <Heart className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">
                  {data?.data?.data?.theme}
                </span>
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                {data?.data?.data?.description}
              </p>
              <div className="flex gap-4">
                <a
                  href="https://facebook.com/caccffuta"
                  target="_blank"
                  className="text-gray-500 hover:text-primary"
                >
                  <SiFacebook className="h-5 w-5" />
                  <span className="sr-only">Facebook</span>
                </a>
                <a
                  href="https://x.com/caccffuta_"
                  target="_blank"
                  className="text-gray-500 hover:text-primary"
                >
                  <SiX className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </a>
                <a
                  href="https://www.instagram.com/caccf_futa/"
                  target="_blank"
                  className="text-gray-500 hover:text-primary"
                >
                  <SiInstagram className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
                </a>
                <a
                  href="https://www.youtube.com/@caccffuta_"
                  target="_blank"
                  className="text-gray-500 hover:text-primary"
                >
                  <SiYoutube className="h-5 w-5" />
                  <span className="sr-only">Youtube</span>
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="text-gray-500">Akure Ondo State, Nigeria.</li>
                <li>
                  <Link
                    href="mailto:isaac33robert@gmail.com"
                    className="text-gray-500 hover:text-primary hover:underline"
                  >
                    caccfoutreachlogistics@gmail.com
                  </Link>
                </li>
                <li className="flex flex-row justify-between gap-3">
                  <Link
                    href="tel:08133642174"
                    className="text-gray-500 hover:text-primary hover:underline"
                  >
                    (+234) 09033880262
                  </Link>
                  /
                  <Link
                    href="tel:08133642174"
                    className="text-gray-500 hover:text-primary hover:underline"
                  >
                    (+234) 09154676739
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 text-center text-gray-50">
            <p>
              &copy; {new Date().getFullYear()} {data?.data?.data?.theme}. All
              rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <div className="fixed right-3 bottom-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipContent>Contact us via WhatsApp</TooltipContent>
            <TooltipTrigger>
              <Button asChild size={'icon'} variant={"outline"} className="bg-white dark:bg-gray-950 min-w-[60px] min-h-[60px] rounded-full shadow-md">
                <a href="https://wa.link/hvvlu9" target="_blank">
                    <SiWhatsapp title="Contact us via WhatsApp" className="text-green-500 size-7"/>
                </a>
              </Button>
          </TooltipTrigger>
          </Tooltip>
        </TooltipProvider>
      </div>

      {data?.data?.data && (
        <OutreachRegisterForm
          open={registerDialog}
          onClose={() => setRegisterDialog(false)}
          outreach={data?.data?.data}
        />
      )}
      {data?.data?.data && (
        <PaymentTopupForm
          open={topupDialog}
          onClose={() => setTopupDialog(false)}
          outreachId={data?.data?.data?.id}
        />
      )}
    </div>
  );
}
