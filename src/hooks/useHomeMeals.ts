import {axios, IApiError} from '@/hooks/axios.config';
import {useAppSelector} from '@/store';
import {useQuery, UseQueryOptions} from '@tanstack/react-query';

interface IHomeMeals {
  meals: {
    id: number;
    user_id: number;
    meal_subscription_id: number;
    meal_id: number;
    date: string;
    day: string;
    meal: {
      images: string[];
      id: number;
      name: string;
      name_ar: string;
      description: string;
      description_ar: string;
      calories: number;
      types: {
        id: number;
        title: string;
        title_ar: string;
      }[];
    };
    selection_id: number;
    type: string;
  }[];
}
async function getHomeMeals(token?: string) {
  const endpoint = `/home/home-meals`;
  const res = await axios.get<IHomeMeals>(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export const useHomeMeals = (
  config?: Omit<UseQueryOptions<IHomeMeals, IApiError>, 'queryKey' | 'queryFn'>,
) => {
  const {access_token} = useAppSelector(state => state.local);
  return useQuery({
    queryKey: ['meal-home'],
    queryFn: () => getHomeMeals(access_token),
    retry: 2,
    ...config,
  });
};
