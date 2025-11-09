import {axios, IApiError} from '@/hooks/axios.config';
import {useAppSelector} from '@/store';
import {useQuery, UseQueryOptions} from '@tanstack/react-query';

export type IGetProfile = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  gender: string;
  sport: string;
  goal: string;
  training_location: null;
  sport_duration: null;
  age: number;
  height: number;
  dietary_preferences: null;
  is_set_up: boolean;
  is_active: boolean;
  deactivated_at: null;
  createdAt: string;
  updatedAt: string;
  weight: number;
  dob: string;
};

async function getProfile(token?: string) {
  const endpoint = `/profile/me`;
  const res = await axios.get<IGetProfile>(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export const useGetProfile = (
  config?: Omit<
    UseQueryOptions<IGetProfile, IApiError>,
    'queryKey' | 'queryFn'
  >,
) => {
  const {access_token} = useAppSelector(state => state.local);
  return useQuery({
    queryKey: ['GetProfile'],
    queryFn: () => getProfile(access_token),
    retry: 2,
    ...config,
  });
};
