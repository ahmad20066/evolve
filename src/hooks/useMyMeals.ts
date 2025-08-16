import {axios, IApiError} from '@/hooks/axios.config';
import {useAppSelector} from '@/store';
import {IMealsMy} from '@/types/myMeal';
import {useQuery, UseQueryOptions} from '@tanstack/react-query';

export type IMyMeals = {
  day: string;
  meals: IMealsMy[];
};

async function getMyMeals(date: string, token?: string) {
  const endpoint = `/diet/my-selections`;
  const res = await axios.get<IMyMeals>(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      date,
    },
  });
  return res.data;
}

export const useMyMeals = (
  date: string,
  config?: Omit<UseQueryOptions<IMyMeals, IApiError>, 'queryKey' | 'queryFn'>,
) => {
  const {access_token} = useAppSelector(state => state.local);
  return useQuery({
    queryKey: ['my-meals', date],
    queryFn: () => getMyMeals(date, access_token),
    retry: 2,
    ...config,
  });
};
