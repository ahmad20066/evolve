import {axios, IApiError} from '@/hooks/axios.config';
import {useAppSelector} from '@/store';
import {useQuery, UseQueryOptions} from '@tanstack/react-query';

export type ICheckSubs = {
  fitnessSubscription: boolean;
  dietSubscription: boolean;
};
async function getCheckSubs(token?: string) {
  const endpoint = `/profile/check-subscription`;
  const res = await axios.get<ICheckSubs>(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export const useCheckSubs = (
  config?: Omit<UseQueryOptions<ICheckSubs, IApiError>, 'queryKey' | 'queryFn'>,
) => {
  const {access_token} = useAppSelector(state => state.local);
  return useQuery({
    queryKey: ['check-subs'],
    queryFn: () => getCheckSubs(access_token),
    retry: 2,
    enabled: !!access_token,
    ...config,
  });
};
