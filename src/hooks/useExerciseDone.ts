import {MutationOptions, useMutation} from '@tanstack/react-query';
import {axios, IApiError} from './axios.config';
import {useAppSelector} from '@/store';

export interface IExerciseDoneArgs {
  exercise_id: number;
  workout_id?: number;
  stats: {
    set: number;
    reps: number;
    weight: number;
  }[];
}

export type IExerciseDoneResult = {
  message: string;
};

async function ExerciseDone(args: IExerciseDoneArgs, access_token?: string) {
  const endpoint = `/fitness/exercise-done`;
  const res = await axios.post<IExerciseDoneResult>(endpoint, args, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  return res.data;
}

export const useExerciseDone = (
  config: MutationOptions<IExerciseDoneResult, IApiError, IExerciseDoneArgs>,
) => {
  const {access_token} = useAppSelector(state => state.local);
  return useMutation<IExerciseDoneResult, IApiError, IExerciseDoneArgs>({
    mutationFn: (args: IExerciseDoneArgs) => ExerciseDone(args, access_token),
    ...config,
  });
};
