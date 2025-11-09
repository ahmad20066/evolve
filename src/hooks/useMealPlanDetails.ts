import {axios, IApiError} from '@/hooks/axios.config';
import {useAppSelector} from '@/store';
import {useQuery, UseQueryOptions} from '@tanstack/react-query';

export type IMealPlanType = {
  id: number;
  title: string;
  title_ar: string;
  [key: string]: any;
};

export type IMealPlanStatistics = {
  totalSubscribers: number;
  totalOrders: number;
  deliveredOrders: number;
  deliverySuccessRate: number;
  totalMeals: number;
};

export type IOrderStatusBreakdown = {
  listed: number;
  pending: number;
  done: number;
  out_for_delivery: number;
  delivered: number;
};

export type IMealPlanOrderStatus = {
  breakdown: IOrderStatusBreakdown;
  total: number;
  delivered: number;
};

export type IMealPlanDetails = {
  id: number;
  title: string;
  title_ar: string;
  description: string;
  description_ar: string;
  calories: number;
  image: string;
  price_monthly: number;
  price_21_days: number | null;
  price_26_days: number | null;
  number_of_days: number;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  types: IMealPlanType[];
  statistics: IMealPlanStatistics;
  orderStatus: IMealPlanOrderStatus;
};

async function getMealPlanDetails(id: number, token?: string) {
  const endpoint = `/diet/meal-plans/${id}/details`;
  const res = await axios.get<IMealPlanDetails>(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export const useMealPlanDetails = (
  id: number,
  config?: Omit<
    UseQueryOptions<IMealPlanDetails, IApiError>,
    'queryKey' | 'queryFn'
  >,
) => {
  const {access_token} = useAppSelector(state => state.local);
  return useQuery({
    queryKey: ['meal-plan-details', id],
    queryFn: () => getMealPlanDetails(id, access_token),
    retry: 2,
    enabled: !!id,
    ...config,
  });
};

