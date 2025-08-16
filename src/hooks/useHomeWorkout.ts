import {axios, IApiError} from '@/hooks/axios.config';
import {useAppSelector} from '@/store';
import {useQuery, UseQueryOptions} from '@tanstack/react-query';
import {IHomeWorkout} from '@/types/workout';

async function getHomeWorkout(token?: string) {
  const endpoint = `/home/home-workouts`;
  const res = await axios.get<IHomeWorkout[]>(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export const useHomeWorkout = (
  config?: Omit<
    UseQueryOptions<IHomeWorkout[], IApiError>,
    'queryKey' | 'queryFn'
  >,
) => {
  const {access_token} = useAppSelector(state => state.local);
  return useQuery({
    queryKey: ['workout-home'],
    queryFn: () => getHomeWorkout(access_token),
    retry: 2,
    ...config,
  });
};
