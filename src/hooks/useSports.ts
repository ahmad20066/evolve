import {axios, IApiError} from '@/hooks/axios.config';
import {useQuery, UseQueryOptions} from '@tanstack/react-query';

export type ISports = {
  id: number;
  title: string;
  image: string;
  title_ar: string;
};

async function getSports() {
  const endpoint = `/auth/sports`;
  const res = await axios.get<ISports[]>(endpoint);
  return res.data;
}

export const useSports = (
  config?: Omit<UseQueryOptions<ISports[], IApiError>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery({
    queryKey: ['sports'],
    queryFn: () => getSports(),
    retry: 2,
    ...config,
  });
};
