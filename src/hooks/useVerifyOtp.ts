import {MutationOptions, useMutation} from '@tanstack/react-query';
import {axios, IApiError} from './axios.config';

export interface IVerifyArgs {
  email: string;
  otp: string;
  method: 'email' | 'phone';
}

export type IVerifyResult = {
  message: string;
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    phone: string;
    password: string;
    role: string;
    gender: string;
    age: string;
    height: string;
    activity_level_id: null;
    health_goal_id: null;
    dietary_preferences: null;
    package_type: null;
    is_set_up: false;
    is_active: true;
    deactivated_at: null;
    createdAt: string;
    updatedAt: string;
  };
};

async function Verify(args: IVerifyArgs) {
  const endpoint = `/auth/verify`;
  const res = await axios.post<IVerifyResult>(endpoint, args);
  return res.data;
}

export const useVerify = (
  config: MutationOptions<IVerifyResult, IApiError, IVerifyArgs>,
) => {
  return useMutation<IVerifyResult, IApiError, IVerifyArgs>({
    mutationFn: (args: IVerifyArgs) => Verify(args),
    ...config,
  });
};
