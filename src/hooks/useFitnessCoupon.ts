import {MutationOptions, useMutation} from '@tanstack/react-query';
import {axios, IApiError} from './axios.config';
import {useAppSelector} from '@/store';

export interface IFitnessCouponArgs {
  package_id: number | undefined;
  pricing_id: number | undefined;
  coupon_code: string | undefined;
}

export type IFitnessCouponResult = {
  coupon_id: number;
  discount: number;
  message: string;
  new_total: number;
  pricing_id: number;
};

async function FitnessCoupon(args: IFitnessCouponArgs, access_token?: string) {
  const endpoint = `/fitness/apply-coupon`;
  const res = await axios.post<IFitnessCouponResult>(endpoint, args, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  return res.data;
}

export const useFitnessCoupon = (
  config: MutationOptions<IFitnessCouponResult, IApiError, IFitnessCouponArgs>,
) => {
  const {access_token} = useAppSelector(state => state.local);
  return useMutation<IFitnessCouponResult, IApiError, IFitnessCouponArgs>({
    mutationFn: (args: IFitnessCouponArgs) => FitnessCoupon(args, access_token),
    ...config,
  });
};
