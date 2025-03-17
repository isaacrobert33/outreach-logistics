"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BankType, OutreachType } from "./types/common";

export const useBanks = () =>
  useQuery({
    queryKey: ["banks"],
    queryFn: async () => {
      const { data } = await axios.get<{ data: BankType[] }>(
        `/api/v1/banks?isPublic=true`
      );
      return data;
    },
  });

export const useOutreachList = () =>
  useQuery({
    queryKey: ["outreach"],
    queryFn: async () => {
      const { data } = await axios.get<{ data: OutreachType[] }>(
        `/api/v1/outreach`
      );
      return data;
    },
  });
