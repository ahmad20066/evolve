import {MutationOptions, useMutation} from '@tanstack/react-query';
import {axios, IApiError} from './axios.config';

export interface ISendOtpArgs {
  email: string;
  method: 'email' | 'phone';
}

export type ISendOtpResult = {
  message: string;
};

async function SendOtp(args: ISendOtpArgs) {
  const endpoint = `/auth/send-otp`;
  const res = await axios.post<ISendOtpResult>(endpoint, args);
  return res.data;
}

export const useSendOtp = (
  config: MutationOptions<ISendOtpResult, IApiError, ISendOtpArgs>,
) => {
  return useMutation<ISendOtpResult, IApiError, ISendOtpArgs>({
    mutationFn: (args: ISendOtpArgs) => SendOtp(args),
    ...config,
  });
};
