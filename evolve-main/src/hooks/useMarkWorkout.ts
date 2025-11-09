import {MutationOptions, useMutation} from '@tanstack/react-query';
import {axios, IApiError} from './axios.config';
import {useAppSelector} from '@/store';

export interface IMarkWorkoutArgs {
  workout_id?: number;
}

export type IMarkWorkoutResult = {
  message: string;
};

async function MarkWorkout(args: IMarkWorkoutArgs, access_token?: string) {
  const endpoint = `/fitness/workout-done`;
  const res = await axios.post<IMarkWorkoutResult>(endpoint, args, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  return res.data;
}

export const useMarkWorkout = (
  config: MutationOptions<IMarkWorkoutResult, IApiError, IMarkWorkoutArgs>,
) => {
  const {access_token} = useAppSelector(state => state.local);
  return useMutation<IMarkWorkoutResult, IApiError, IMarkWorkoutArgs>({
    mutationFn: (args: IMarkWorkoutArgs) => MarkWorkout(args, access_token),
    ...config,
  });
};
