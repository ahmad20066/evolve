import {MutationOptions, useMutation} from '@tanstack/react-query';
import {axios, IApiError} from './axios.config';
import {useAppSelector} from '@/store';

export interface ISetWeightArgs {
  weight: number;
}
export type ISetWeightResult = {
  message: string;
};

async function setWeight(args: ISetWeightArgs, token?: string) {
  const endpoint = `/auth/set-weight`;
  const res = await axios.post<ISetWeightResult>(endpoint, args, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export const useSetWeight = (
  config: MutationOptions<ISetWeightResult, IApiError, ISetWeightArgs>,
) => {
  const {access_token} = useAppSelector(state => state.local);
  return useMutation<ISetWeightResult, IApiError, ISetWeightArgs>({
    mutationFn: (args: ISetWeightArgs) => setWeight(args, access_token),
    ...config,
  });
};
