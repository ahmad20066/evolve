import {MutationOptions, useMutation} from '@tanstack/react-query';
import {axios, IApiError} from './axios.config';

export interface IResetPasswordArgs {
  email: string;
  otp: number;
  newPassword: string;
}

export type IResetPasswordResult = {
  message: string;
};

async function ResetPassword(args: IResetPasswordArgs) {
  const endpoint = `/auth/reset-password`;
  const res = await axios.post<IResetPasswordResult>(endpoint, args);
  return res.data;
}

export const useResetPassword = (
  config: MutationOptions<IResetPasswordResult, IApiError, IResetPasswordArgs>,
) => {
  return useMutation<IResetPasswordResult, IApiError, IResetPasswordArgs>({
    mutationFn: (args: IResetPasswordArgs) => ResetPassword(args),
    ...config,
  });
};
