import {MutationOptions, useMutation} from '@tanstack/react-query';
import {axios, IApiError} from './axios.config';
import {useAppSelector} from '@/store';

export interface IFeedbackArgs {
  workout_id: number;
  rating: number;
  message: string;
}

export type IFeedbackResult = {
  message: string;
};

async function Feedback(args: IFeedbackArgs, access_token?: string) {
  const endpoint = `/fitness/feedback`;
  const res = await axios.post<IFeedbackResult>(endpoint, args, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  return res.data;
}

export const useFeedback = (
  config: MutationOptions<IFeedbackResult, IApiError, IFeedbackArgs>,
) => {
  const {access_token} = useAppSelector(state => state.local);
  return useMutation<IFeedbackResult, IApiError, IFeedbackArgs>({
    mutationFn: (args: IFeedbackArgs) => Feedback(args, access_token),
    ...config,
  });
};
