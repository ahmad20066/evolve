import {axios, IApiError} from '@/hooks/axios.config';
import {useAppSelector} from '@/store';
import {useQuery, UseQueryOptions} from '@tanstack/react-query';

export type IPackageWorkouts = {
  id: number;
  image: string;
  title: string;
  title_ar: string;
  type: string;
  difficulty_level: string;
  description: string;
  description_ar: string;
  duration: number;
  coach: number;
  user_id: null;
  date: string;
  package_id: number;
  motivational_message: string;
  motivational_message_ar: string;
  is_Active: true;
  day?: string;
  reviews: [];
};

async function getPackageWorkouts(id: number, token?: string) {
  const endpoint = `/fitness/package-workouts`;
  const res = await axios.get<IPackageWorkouts[]>(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      package_id: id,
    },
  });
  return res.data;
}

export const usePackageWorkouts = (
  id: number,
  config?: Omit<
    UseQueryOptions<IPackageWorkouts[], IApiError>,
    'queryKey' | 'queryFn'
  >,
) => {
  const {access_token} = useAppSelector(state => state.local);
  return useQuery({
    queryKey: ['package-workout', id],
    queryFn: () => getPackageWorkouts(id, access_token),
    retry: 2,
    ...config,
  });
};
