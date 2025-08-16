import {MutationOptions, useMutation} from '@tanstack/react-query';
import {axios, IApiError} from './axios.config';

export interface ISetupAccountArgs {
  age: number;
  gender: string;
  weight: number;
  height: number;
  goal: string;
  sport: number;
  sport_duration: string;
  training_location: string;
}

export type ISetupAccountResult = {
  message: string;
};

async function setupAccount(args: ISetupAccountArgs, token: string) {
  const endpoint = `/auth/setup_profile`;
  const res = await axios.post<ISetupAccountResult>(endpoint, args, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export const useSetupAccount = (
  token: string,
  config: MutationOptions<ISetupAccountResult, IApiError, ISetupAccountArgs>,
) => {
  return useMutation<ISetupAccountResult, IApiError, ISetupAccountArgs>({
    mutationFn: (args: ISetupAccountArgs) => setupAccount(args, token),
    ...config,
  });
};
