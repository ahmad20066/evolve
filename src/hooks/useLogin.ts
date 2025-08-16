import {MutationOptions, useMutation} from '@tanstack/react-query';
import {axios, IApiError} from './axios.config';

export interface ILoginArgs {
  email: string;
  password: string;
  fcm_token?: string;
}

export type ILoginResult = {
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

async function Login(args: ILoginArgs) {
  const endpoint = `/auth/login`;
  const res = await axios.post<ILoginResult>(endpoint, args);
  return res.data;
}

export const useLogin = (
  config: MutationOptions<ILoginResult, IApiError, ILoginArgs>,
) => {
  return useMutation<ILoginResult, IApiError, ILoginArgs>({
    mutationFn: (args: ILoginArgs) => Login(args),
    ...config,
  });
};
