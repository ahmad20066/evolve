import {axios, IApiError} from '@/hooks/axios.config';
import {useAppSelector} from '@/store';
import {useQuery, UseQueryOptions} from '@tanstack/react-query';

export type IExerciseID = {
  image_urls: string[];
  notes: string[];
  id: number;
  name: string;
  name_ar: string;
  description: string;
  description_ar: string;
  stats: {duration: number; sets: number; reps: number};
  target_muscles_image: string;
  video_url: string;
  createdAt: string;
  updatedAt: string;
  cooling_time: number;
  status: string;
};
async function getExercise(id: number, workout_id?: number, token?: string) {
  const endpoint = `/fitness/exercise/${id}`;
  const res = await axios.get<IExerciseID>(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {workout_id},
  });
  return res.data;
}

export const useExercise = (
  id: number,
  workout_id?: number,

  config?: Omit<
    UseQueryOptions<IExerciseID, IApiError>,
    'queryKey' | 'queryFn'
  >,
) => {
  const {access_token} = useAppSelector(state => state.local);
  return useQuery({
    queryKey: ['exercise', id, workout_id],
    queryFn: () => getExercise(id, workout_id, access_token),
    retry: 2,
    ...config,
  });
};
