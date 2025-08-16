import {MutationOptions, useMutation} from '@tanstack/react-query';
import {axios, IApiError} from './axios.config';
import {useAppSelector} from '@/store';

export interface IRenewMealArgs {
  id: number;
}

export type IRenewMealResult = {
  message: string;
};

async function RenewMeal(args: IRenewMealArgs, access_token?: string) {
  const endpoint = `/diet/renew-meal?subscription_id=${args.id}`;
  const res = await axios.post<IRenewMealResult>(endpoint, args, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  return res.data;
}

export const useRenewMeal = (
  config: MutationOptions<IRenewMealResult, IApiError, IRenewMealArgs>,
) => {
  const {access_token} = useAppSelector(state => state.local);
  return useMutation<IRenewMealResult, IApiError, IRenewMealArgs>({
    mutationFn: (args: IRenewMealArgs) => RenewMeal(args, access_token),
    ...config,
  });
};
