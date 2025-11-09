import {axios, IApiError} from '@/hooks/axios.config';
import {useAppSelector} from '@/store';
import {useQuery, UseQueryOptions} from '@tanstack/react-query';

export type IBanner = {
  id: number;
  image: string;
  createdAt: string;
  updatedAt: string;
};

async function getBanner(token?: string) {
  const endpoint = `/home/banner`;
  const res = await axios.get<IBanner[]>(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export const useBanner = (
  config?: Omit<UseQueryOptions<IBanner[], IApiError>, 'queryKey' | 'queryFn'>,
) => {
  const {access_token} = useAppSelector(state => state.local);
  return useQuery({
    queryKey: ['banner'],
    queryFn: () => getBanner(access_token),
    retry: 2,
    ...config,
  });
};
