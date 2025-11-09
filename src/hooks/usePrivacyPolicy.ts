import {axios, IApiError} from '@/hooks/axios.config';
import {useAppSelector} from '@/store';
import {useQuery, UseQueryOptions} from '@tanstack/react-query';

export type IPrivacyPolicy = {
  id: number;
  content: string;
  content_ar: string;
};

async function PrivacyPolicy(token?: string) {
  const endpoint = `/info/privacy-policy`;
  const res = await axios.get<IPrivacyPolicy>(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export const usePrivacyPolicy = (
  config?: Omit<
    UseQueryOptions<IPrivacyPolicy, IApiError>,
    'queryKey' | 'queryFn'
  >,
) => {
  const {access_token} = useAppSelector(state => state.local);
  return useQuery({
    queryKey: ['PrivacyPolicy'],
    queryFn: () => PrivacyPolicy(access_token),
    retry: 2,
    ...config,
  });
};
