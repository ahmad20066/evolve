import {MutationOptions, useMutation} from '@tanstack/react-query';
import {axios, IApiError} from './axios.config';

export interface ISignupArgs {
  email: string;
  password: string;
  phone: string;
  name: string;
  role: 'consumer';
  fcm_token?: string;
}

export type ISignupResult = {
  message: string;
  user: {
    email: string;
  };
};

async function signup(args: ISignupArgs) {
  const endpoint = `/auth/register`;
  const res = await axios.post<ISignupResult>(endpoint, args);
  return res.data;
}

export const useSignup = (
  config: MutationOptions<ISignupResult, IApiError, ISignupArgs>,
) => {
  return useMutation<ISignupResult, IApiError, ISignupArgs>({
    mutationFn: (args: ISignupArgs) => signup(args),
    ...config,
  });
};
