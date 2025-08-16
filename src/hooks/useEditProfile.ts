import {MutationOptions, useMutation} from '@tanstack/react-query';
import {axios, IApiError} from './axios.config';
import {useAppSelector} from '@/store';

export interface IEditProfileArgs {
  name: string;
  email: string;
  phone: string;
  dob: string;
}

export type IEditProfileResult = {
  message: string;
};

async function EditProfile(args: IEditProfileArgs, access_token?: string) {
  const endpoint = `/profile/update`;
  const res = await axios.put<IEditProfileResult>(endpoint, args, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  return res.data;
}

export const useEditProfile = (
  config: MutationOptions<IEditProfileResult, IApiError, IEditProfileArgs>,
) => {
  const {access_token} = useAppSelector(state => state.local);
  return useMutation<IEditProfileResult, IApiError, IEditProfileArgs>({
    mutationFn: (args: IEditProfileArgs) => EditProfile(args, access_token),
    ...config,
  });
};
