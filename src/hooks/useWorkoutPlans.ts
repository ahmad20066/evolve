import { axios, IApiError } from "@/hooks/axios.config";
import { useAppSelector } from "@/store";
import { IPricing } from "@/types/pricing";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export type IWorkoutPlans = {
  id: number | string;
  name: string;
  description: string;
  name_ar: string;
  description_ar: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  pricings: IPricing[];
};

async function getWorkoutPlans(token?: string) {
  const endpoint = `/fitness/packages`;
  const res = await axios.get<IWorkoutPlans[]>(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export const useWorkoutPlans = (
  config?: Omit<
    UseQueryOptions<IWorkoutPlans[], IApiError>,
    "queryKey" | "queryFn"
  >
) => {
  const { access_token } = useAppSelector((state) => state.local);
  return useQuery({
    queryKey: ["Workout-Plans"],
    queryFn: () => getWorkoutPlans(access_token),
    retry: 2,
    ...config,
  });
};
