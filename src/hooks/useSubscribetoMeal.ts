import {MutationOptions, useMutation} from '@tanstack/react-query';
import {axios, IApiError} from './axios.config';
import {useAppSelector} from '@/store';

export interface ISubscribeMealsArgs {
  meal_plan_id?: number;
  delivery_time_id: number | undefined;
  street: string | undefined;
  city: string | undefined;
  address_label: string | undefined;
  building: string | undefined;
  postal_code: string | undefined;
  delivery_notes: string | undefined;
  state: string | undefined;
}

export type ISubscribeMealsResult = {
  message: string;
};

async function SubscribeMeals(
  args: ISubscribeMealsArgs,
  access_token?: string,
) {
  const endpoint = `/diet/subscribe`;
  const res = await axios.post<ISubscribeMealsResult>(endpoint, args, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  return res.data;
}

export const useSubscribeMeals = (
  config: MutationOptions<
    ISubscribeMealsResult,
    IApiError,
    ISubscribeMealsArgs
  >,
) => {
  const {access_token} = useAppSelector(state => state.local);
  return useMutation<ISubscribeMealsResult, IApiError, ISubscribeMealsArgs>({
    mutationFn: (args: ISubscribeMealsArgs) =>
      SubscribeMeals(args, access_token),
    ...config,
  });
};
