"use client";
import EventRegistration from "@/app/ui/outreach/registration";
import HeroSection from "@/app/ui/outreach/hero-section";
import Footer from "@/app/ui/outreach/footer";
import axios from "axios";
import { OutreachType } from "@/lib/types/common";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "next/navigation";

const fetchOutreach = async (id?: string) => {
  return axios.get<{ data: OutreachType }>(`/api/v1/outreach/${id}`);
};

export default function Outreach({ params }: { params: { id?: string } }) {
  const { id } = useParams<any>();

  const { data, isLoading } = useQuery({
    queryKey: ["outreachData", params],
    queryFn: () => fetchOutreach(id as any),
    enabled: !!id,
  });

  return (
    <div className="min-h-screen flex flex-col">
      {isLoading || !data ? (
        <div className="flex justify-center items-center"></div>
      ) : (
        <>
          <HeroSection data={data?.data?.data} />
          <EventRegistration />
          <Footer data={data?.data?.data} />
        </>
      )}
    </div>
  );
}
