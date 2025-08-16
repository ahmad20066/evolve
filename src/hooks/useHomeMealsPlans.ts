import {axios, IApiError} from '@/hooks/axios.config';
import {useAppSelector} from '@/store';
import {useQuery, UseQueryOptions} from '@tanstack/react-query';
import {IMealPlans} from './useMealPlans';

async function getHomeMeals(token?: string) {
  const endpoint = `/home/plans`;
  const res = await axios.get<IMealPlans[]>(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export const useHomeMealsPlans = (
  config?: Omit<
    UseQueryOptions<IMealPlans[], IApiError>,
    'queryKey' | 'queryFn'
  >,
) => {
  const {access_token} = useAppSelector(state => state.local);
  return useQuery({
    queryKey: ['meal-home-plans'],
    queryFn: () => getHomeMeals(access_token),
    retry: 2,
    ...config,
  });
};
