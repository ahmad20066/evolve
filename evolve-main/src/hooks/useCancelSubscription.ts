import {MutationOptions, useMutation} from '@tanstack/react-query';
import {axios, IApiError} from './axios.config';
import {useAppSelector} from '@/store';

export interface ICancelSubArgs {
  id: number;
  type: 'diet' | 'fitness';
}

export type ICancelSubResult = {
  message: string;
};

async function cancelSub(args: ICancelSubArgs, token?: string) {
  const endpoint = `/profile/cancel-subscription`;
  const res = await axios.post<ICancelSubResult>(endpoint, args, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export const useCancelSub = (
  config: MutationOptions<ICancelSubResult, IApiError, ICancelSubArgs>,
) => {
  const {access_token} = useAppSelector(state => state.local);
  return useMutation<ICancelSubResult, IApiError, ICancelSubArgs>({
    mutationFn: (args: ICancelSubArgs) => cancelSub(args, access_token),
    ...config,
  });
};
