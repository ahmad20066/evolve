import {MutationOptions, useMutation} from '@tanstack/react-query';
import {axios, IApiError} from './axios.config';
import {useAppSelector} from '@/store';

export interface IDeleteAccountArgs {}

export type IDeleteAccountResult = {
  message: string;
};

async function DeleteAccount(args: IDeleteAccountArgs, access_token?: string) {
  const endpoint = `/auth/delete-account`;
  const res = await axios.post<IDeleteAccountResult>(endpoint, args, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  return res.data;
}

export const useDeleteAccount = (
  config: MutationOptions<IDeleteAccountResult, IApiError, IDeleteAccountArgs>,
) => {
  const {access_token} = useAppSelector(state => state.local);
  return useMutation<IDeleteAccountResult, IApiError, IDeleteAccountArgs>({
    mutationFn: (args: IDeleteAccountArgs) => DeleteAccount(args, access_token),
    ...config,
  });
};
