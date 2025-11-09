import {axios, IApiError} from '@/hooks/axios.config';
import {useAppSelector} from '@/store';
import {useQuery, UseQueryOptions} from '@tanstack/react-query';

export type IOrders = {
  id: number;
  user_id: number;
  meal_subscription_id: number;
  order_date: string;
  status: string;
  deliveryTime: {
    id: number;
    title: string;
    title_ar: string;
  };
};

async function getOrders(token?: string) {
  const endpoint = `/profile/orders`;
  const res = await axios.get<IOrders[]>(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export const useOrders = (
  config?: Omit<UseQueryOptions<IOrders[], IApiError>, 'queryKey' | 'queryFn'>,
) => {
  const {access_token} = useAppSelector(state => state.local);
  return useQuery({
    queryKey: ['order-history', access_token],
    queryFn: () => getOrders(access_token),
    retry: 2,
    ...config,
  });
};
