import {MutationOptions, useMutation} from '@tanstack/react-query';
import {axios, IApiError} from './axios.config';
import {useAppSelector} from '@/store';

export interface IJoinWorkoutArgs {
  workout_id?: number;
}

export type IJoinWorkoutResult = {
  message: string;
};

async function JoinWorkout(args: IJoinWorkoutArgs, access_token?: string) {
  const endpoint = `/fitness/join-workout`;
  const res = await axios.post<IJoinWorkoutResult>(endpoint, args, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  return res.data;
}

export const useJoinWorkout = (
  config: MutationOptions<IJoinWorkoutResult, IApiError, IJoinWorkoutArgs>,
) => {
  const {access_token} = useAppSelector(state => state.local);
  return useMutation<IJoinWorkoutResult, IApiError, IJoinWorkoutArgs>({
    mutationFn: (args: IJoinWorkoutArgs) => JoinWorkout(args, access_token),
    ...config,
  });
};
