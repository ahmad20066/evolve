import {axios, IApiError} from '@/hooks/axios.config';
import {useAppSelector} from '@/store';
import {IMealsofWeek} from '@/types/weakMeals';
import {useQuery, UseQueryOptions} from '@tanstack/react-query';

interface IWeekMeals {
  day: string;
  meals: IMealsofWeek[];
}

async function getWeekMeals(date: string, type?: number, token?: string) {
  const endpoint = `/diet/week-meals?date=${date}&type=${type}`;
  const res = await axios.get<IWeekMeals>(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export const useWeekMeals = (
  date: string,
  type?: number,
  config?: Omit<UseQueryOptions<IWeekMeals, IApiError>, 'queryKey' | 'queryFn'>,
) => {
  const {access_token} = useAppSelector(state => state.local);
  return useQuery({
    queryKey: ['week-meals', date, type],
    queryFn: () => getWeekMeals(date, type, access_token),
    retry: 2,
    ...config,
  });
};
