"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import AOS from "aos";
import "aos/dist/aos.css";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  Users,
  Lightbulb,
  Heart,
  Globe,
  Menu,
  X,
  ChevronRight,
  Linkedin,
  Loader2,
} from "lucide-react";
import {
  SiFacebook,
  SiX,
  SiInstagram,
  SiYoutube,
} from "@icons-pack/react-simple-icons";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { OutreachType } from "@/lib/types/common";
import { OutreachRegisterForm } from "./payment-form";

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [registerDialog, setRegisterDialog] = useState<boolean>(false);
  const { data, isLoading } = useQuery({
    queryKey: ["latestOutreach"],
    queryFn: () => axios.get<{ data: OutreachType }>(`/api/v1/outreach/latest`),
  });

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      mirror: true,
    });
  }, []);

  return isLoading ? (
    <div className="flex flex-col gap-9 items-center justify-center w-full h-full p-8">
      <Loader2 className="mr-2 h-6 w-6 animate-spin" />
      Fetching Outreach information, please wait...
    </div>
  ) : (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      {/* Navigation */}
      <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/80">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
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
                      {data?.data?.data?.dateTime || "Anticipate"}
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
                      {data?.data?.data?.dateTime || "Anticipate"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  className="font-medium"
                  onClick={() => setRegisterDialog(true)}
                >
                  Register Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                {/* <Button size="lg" variant="outline" className="font-medium">
                  Learn More
                </Button> */}
              </div>
            </div>
            <div
              className="mx-auto lg:mx-0 relative"
              data-aos="fade-left"
              data-aos-delay="200"
            >
              <div className="absolute -inset-4 rounded-xl bg-gradient-to-r from-primary/20 to-purple-500/20 blur-xl" />
              <Image
                src="/outreach.jpg"
                alt="Event Image"
                width={550}
                height={550}
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover opacity-45"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Registration Section */}
      {/* <section
        id="register"
        className="py-16 md:py-24 bg-primary/5 dark:bg-primary/10"
      >
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div data-aos="fade-right">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Register for the Event
              </h2>
              <p className="mt-4 text-gray-500 dark:text-gray-400 md:text-xl">
                Secure your spot at our Global Outreach Summit and be part of a
                movement that's creating positive change around the world.
              </p>
              <ul className="mt-6 grid gap-2">
                {[
                  "Access to all keynote sessions and workshops",
                  "Networking opportunities with industry leaders",
                  "Participation in hands-on community projects",
                  "Event materials and resources",
                  "Certificate of participation",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Card className="w-full" data-aos="fade-left" data-aos-delay="200">
              <CardHeader>
                <CardTitle>Register Now</CardTitle>
                <CardDescription>
                  Fill out the form below to secure your spot at the event.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="first-name"
                        className="text-sm font-medium leading-none"
                      >
                        First name
                      </label>
                      <Input
                        id="first-name"
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="last-name"
                        className="text-sm font-medium leading-none"
                      >
                        Last name
                      </label>
                      <Input
                        id="last-name"
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium leading-none"
                    >
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="organization"
                      className="text-sm font-medium leading-none"
                    >
                      Organization
                    </label>
                    <Input
                      id="organization"
                      placeholder="Enter your organization"
                    />
                  </div>
                </form>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Complete Registration</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="border-t bg-white dark:bg-gray-950 dark:border-gray-800 mt-[8%]">
        <div className="container px-4 md:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
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
                <li className="text-gray-500">{data?.data?.data?.address}</li>
                <li>
                  <Link
                    href="mailto:info@outreachconnect.com"
                    className="text-gray-500 hover:text-primary"
                  >
                    isaac33robert@gmail.com
                  </Link>
                </li>
                <li>
                  <Link
                    href="tel:+1234567890"
                    className="text-gray-500 hover:text-primary"
                  >
                    (+234) 08133642174
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

      {data?.data?.data && (
        <OutreachRegisterForm
          open={registerDialog}
          onClose={() => setRegisterDialog(false)}
          outreachId={data?.data?.data?.id}
        />
      )}
    </div>
  );
}
