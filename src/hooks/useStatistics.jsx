import { useQuery } from "@tanstack/react-query";
import { statisticsServices } from "../services/statisticsServices";

const statisticsKeys = {
  all: ["statistics"],
  summary: () => [...statisticsKeys.all, "summary"],
  upcomingSchedules: () => [...statisticsKeys.all, "upcoming-schedules"],
  jobOpenings: () => [...statisticsKeys.all, "job-openings"],
};

export const useSummaryStatistics = () => {
  return useQuery({
    queryKey: statisticsKeys.summary(),
    queryFn: statisticsServices.getSummary,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useUpcomingSchedules = () => {
  return useQuery({
    queryKey: statisticsKeys.upcomingSchedules(),
    queryFn: statisticsServices.getUpcomingSchedules,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useJobOpenings = () => {
  return useQuery({
    queryKey: statisticsKeys.jobOpenings(),
    queryFn: statisticsServices.getJobOpenings,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
