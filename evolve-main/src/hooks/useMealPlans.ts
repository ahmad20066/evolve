import { axios, IApiError } from "@/hooks/axios.config";
import { useAppSelector } from "@/store";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export type IMealPlans = {
  id: number;
  title: string;
  title_ar: string;
  calories: number;
  image: string;
  price_monthly: number;
  createdAt: string;
  updatedAt: string;
  number_of_days: number;
  types: {
    id: number;
    title: string;
    createdAt: string;
    updatedAt: string;
  }[];
};

async function getMealPlans(number_of_meals: number, token?: string) {
  const endpoint = `/diet/meal-plans`;
  const res = await axios.get<IMealPlans[]>(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      number_of_meals,
    },
  });
  return res.data;
}

export const useMealPlans = (
  number_of_meals: number,
  config?: Omit<
    UseQueryOptions<IMealPlans[], IApiError>,
    "queryKey" | "queryFn"
  >
) => {
  const { access_token } = useAppSelector((state) => state.local);
  return useQuery({
    queryKey: ["meal-Plans", number_of_meals],
    queryFn: () => getMealPlans(number_of_meals, access_token),
    retry: 2,
    ...config,
  });
};
