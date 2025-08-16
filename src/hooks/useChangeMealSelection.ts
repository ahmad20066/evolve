import {MutationOptions, useMutation} from '@tanstack/react-query';
import {axios, IApiError} from './axios.config';
import {useAppSelector} from '@/store';

export interface IChangeMealArgs {
  selection_id: number;
  meal_id?: number;
}

export type IChangeMealResult = {
  message: string;
};

async function ChangeMeal(args: IChangeMealArgs, access_token?: string) {
  const endpoint = `/diet/change-selection`;
  const res = await axios.post<IChangeMealResult>(endpoint, args, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  return res.data;
}

export const useChangeMeal = (
  config: MutationOptions<IChangeMealResult, IApiError, IChangeMealArgs>,
) => {
  const {access_token} = useAppSelector(state => state.local);
  return useMutation<IChangeMealResult, IApiError, IChangeMealArgs>({
    mutationFn: (args: IChangeMealArgs) => ChangeMeal(args, access_token),
    ...config,
  });
};
