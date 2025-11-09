import {MutationOptions, useMutation} from '@tanstack/react-query';
import {axios, IApiError} from './axios.config';
import {useAppSelector} from '@/store';

export interface IRenewWorkoutArgs {
  id: number;
}

export type IRenewWorkoutResult = {
  message: string;
};

async function RenewWorkout(args: IRenewWorkoutArgs, access_token?: string) {
  const endpoint = `/fitness/renew?subscription_id=${args.id}`;
  const res = await axios.post<IRenewWorkoutResult>(endpoint, args, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  return res.data;
}

export const useRenewWorkout = (
  config: MutationOptions<IRenewWorkoutResult, IApiError, IRenewWorkoutArgs>,
) => {
  const {access_token} = useAppSelector(state => state.local);
  return useMutation<IRenewWorkoutResult, IApiError, IRenewWorkoutArgs>({
    mutationFn: (args: IRenewWorkoutArgs) => RenewWorkout(args, access_token),
    ...config,
  });
};
