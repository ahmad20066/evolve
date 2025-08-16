import {axios, IApiError} from '@/hooks/axios.config';
import {useAppSelector} from '@/store';
import {IMealsofWeek} from '@/types/weakMeals';
import {useQuery, UseQueryOptions} from '@tanstack/react-query';

export type IOrdersbyID = {
  id: number;
  user_id: number;
  meal_subscription_id: number;
  order_date: string;
  status: string;
  meals: IMealsofWeek[];
  subscription: {
    address: {
      id: number;
      street: string;
      city: string;
      address_label: string;
      building: string;
      postal_code: string;
      state: string;
      delivery_notes: string;
    };
    delivery_time: {
      id: 1;
      title: string;
      title_ar: string;
    };
  };
};

async function getOrdersbyID(id: number, token?: string) {
  const endpoint = `/profile/orders/${id}`;
  const res = await axios.get<IOrdersbyID>(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export const useOrdersbyID = (
  id: number,
  config?: Omit<
    UseQueryOptions<IOrdersbyID, IApiError>,
    'queryKey' | 'queryFn'
  >,
) => {
  const {access_token} = useAppSelector(state => state.local);
  return useQuery({
    queryKey: ['order-history-id', id, access_token],
    queryFn: () => getOrdersbyID(id, access_token),
    retry: 2,
    ...config,
  });
};
