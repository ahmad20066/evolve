import { axios, IApiError } from "@/hooks/axios.config";
import { useAppSelector } from "@/store";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export type IExercises = {
  image_urls: string[];
  notes: string[];
  id: number;
  name: string;
  name_ar: string;
  description: string;
  description_ar: string;
  stats: { duration: number; sets: number; reps: number };
  target_muscles_image: string;
  video_url: string;
  createdAt: string;
  updatedAt: string;
  cooling_time: number;
  status: string;
};
async function getExercises(token?: string) {
  const endpoint = `/fitness/exercises`;
  const res = await axios.get<IExercises[]>(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export const useExercises = (
  config?: Omit<
    UseQueryOptions<IExercises[], IApiError>,
    "queryKey" | "queryFn"
  >
) => {
  const { access_token } = useAppSelector((state) => state.local);
  return useQuery({
    queryKey: ["exercises"],
    queryFn: () => getExercises(access_token),
    retry: 2,
    ...config,
  });
};
