import {axios, IApiError} from '@/hooks/axios.config';
import {useAppSelector} from '@/store';
import {useQuery, UseQueryOptions} from '@tanstack/react-query';

export type ICurrentSubs = {
  fitnessSubscription: {
    days_left: number;
    id: number;
    package_id: number;
    pricing_id: number;
    start_date: string;
    end_date: string;
    is_active: boolean;
    createdAt: string;
    updatedAt: string;
    package: {
      id: number;
      name: string;
      name_ar: string;
      description: string;
      type: string;
      is_active: boolean;
    };
    pricing: {
      id: number;
      title: string;
      title_ar: string;
      price: number;
      number_of_days: number;
      package_id: number;
      is_active: boolean;
    };
  };
  dietSubscription: {
    id: number;
    type: string;
    meal_plan_id: number;
    package_id: number;
    pricing_id: number;
    user_id: number;
    is_active: boolean;
    start_date: string;
    end_date: string;
    delivery_time_id: number;
    address_id: number;
    meal_plan: {
      id: number;
      title: string;
      title_ar: string;
      calories: number;
      image: string;
      price_monthly: number;
      is_active: boolean;
    };
  };
};

async function getCurrentSubs(token?: string) {
  const endpoint = `/profile/current-subscription`;
  const res = await axios.get<ICurrentSubs>(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export const useCurrentSubs = (
  config?: Omit<
    UseQueryOptions<ICurrentSubs, IApiError>,
    'queryKey' | 'queryFn'
  >,
) => {
  const {access_token} = useAppSelector(state => state.local);
  return useQuery({
    queryKey: ['current-subs'],
    queryFn: () => getCurrentSubs(access_token),
    retry: 2,
    ...config,
  });
};
