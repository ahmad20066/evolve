import {axios, IApiError} from '@/hooks/axios.config';
import {useAppSelector} from '@/store';
import {useQuery, UseQueryOptions} from '@tanstack/react-query';
import {IMealPlans} from './useMealPlans';

interface IDietTypes {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
}

async function getDietTypes(token?: string) {
  const endpoint = `/diet/types`;
  const res = await axios.get<IDietTypes[]>(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export const useDietTypes = (
  config?: Omit<
    UseQueryOptions<IDietTypes[], IApiError>,
    'queryKey' | 'queryFn'
  >,
) => {
  const {access_token} = useAppSelector(state => state.local);
  return useQuery({
    queryKey: ['diet-types'],
    queryFn: () => getDietTypes(access_token),
    retry: 2,
    ...config,
  });
};
