import {axios, IApiError} from '@/hooks/axios.config';
import {useAppSelector} from '@/store';
import {IExercise} from '@/types/exercises';
import {useQuery, UseQueryOptions} from '@tanstack/react-query';

export type IExercisebyDay = {
  id: number;
  title: string;
  title_ar: string;
  type: string;
  difficulty_level: string;
  description: string;
  description_ar: string;
  duration: number;
  coach: number;
  user_id: number;
  day: string;
  package_id: number;
  createdAt: string;
  updatedAt: string;
  exercises: IExercise[];
  session_joined: boolean;
  session_completed: boolean;
};
async function getExercisebyDay(date: string, token?: string) {
  const endpoint = `/fitness/workouts`;
  const res = await axios.get<IExercisebyDay>(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {date},
  });
  return res.data;
}

export const useExercisebyDay = (
  date: string,
  config?: Omit<
    UseQueryOptions<IExercisebyDay, IApiError>,
    'queryKey' | 'queryFn'
  >,
) => {
  const {access_token} = useAppSelector(state => state.local);
  return useQuery({
    queryKey: ['exercise-day', date],
    queryFn: () => getExercisebyDay(date, access_token),
    retry: 2,
    ...config,
  });
};
