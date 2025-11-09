import {MutationOptions, useMutation} from '@tanstack/react-query';
import {axios, IApiError} from './axios.config';
import {useAppSelector} from '@/store';

export interface IMealCouponArgs {
  coupon_code: string | undefined;
  meal_plan_id: number | undefined;
}

export type IMealCouponResult = {
  message: string;
};

async function MealCoupon(args: IMealCouponArgs, access_token?: string) {
  const endpoint = `/diet/apply-coupon`;
  const res = await axios.post<IMealCouponResult>(endpoint, args, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  return res.data;
}

export const useMealCoupon = (
  config: MutationOptions<IMealCouponResult, IApiError, IMealCouponArgs>,
) => {
  const {access_token} = useAppSelector(state => state.local);
  return useMutation<IMealCouponResult, IApiError, IMealCouponArgs>({
    mutationFn: (args: IMealCouponArgs) => MealCoupon(args, access_token),
    ...config,
  });
};
