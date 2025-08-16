import {axios, IApiError} from '@/hooks/axios.config';
import {useAppSelector} from '@/store';
import {useQuery, UseQueryOptions} from '@tanstack/react-query';

export type IMealPlans = {
  id: number;
  title: string;
  title_ar: string;
  calories: number;
  image: string;
  price_monthly: number;
  createdAt: string;
  updatedAt: string;
  types: {
    id: number;
    title: string;
    createdAt: string;
    updatedAt: string;
  }[];
};

async function getMealPlans(token?: string) {
  const endpoint = `/diet/meal-plans`;
  const res = await axios.get<IMealPlans[]>(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export const useMealPans = (
  config?: Omit<
    UseQueryOptions<IMealPlans[], IApiError>,
    'queryKey' | 'queryFn'
  >,
) => {
  const {access_token} = useAppSelector(state => state.local);
  return useQuery({
    queryKey: ['meal-Plans'],
    queryFn: () => getMealPlans(access_token),
    retry: 2,
    ...config,
  });
};
