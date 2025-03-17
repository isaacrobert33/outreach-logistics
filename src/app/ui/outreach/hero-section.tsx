"use client";

import { CalendarIcon, MapPinIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OutreachType } from "@/lib/types/common";
import { useState } from "react";
import { OutreachRegisterForm } from "../payment-form";

export default function HeroSection({ data }: { data: OutreachType }) {
  const [registerDialog, setRegisterDialog] = useState<boolean>(false);

  return (
    <div className="relative bg-primary text-primary-foreground overflow-hidden">
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1600')] bg-cover bg-center opacity-20"></div>
      <div className="relative container mx-auto px-4 py-16 md:py-24 lg:py-32">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            {data.theme}
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl">
            {data.description}
          </p>

          <div className="flex flex-col md:flex-row gap-4 mb-10">
            <div className="flex items-center">
              <CalendarIcon className="mr-2 h-5 w-5" />
              <span>Anticipate</span>
            </div>
            <div className="flex items-center">
              <MapPinIcon className="mr-2 h-5 w-5" />
              <span>{data?.location}</span>
            </div>
            {/* <div className="flex items-center">
              <Clock10Icon className="mr-2 h-5 w-5" />
              <span>9:00 AM - 5:00 PM</span>
            </div> */}
          </div>

          <Button
            size="lg"
            className="text-lg px-8 bg-green-700 hover:bg-green-800 hover:border-2 hover:border-gray-300 text-white"
            onClick={() => setRegisterDialog(true)}
          >
            Register Now
          </Button>
        </div>
      </div>
      <OutreachRegisterForm
        open={registerDialog}
        onClose={() => setRegisterDialog(false)}
        outreach={data}
      />
    </div>
  );
}
