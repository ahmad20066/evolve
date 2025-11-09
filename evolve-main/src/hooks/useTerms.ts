import {axios, IApiError} from '@/hooks/axios.config';
import {useAppSelector} from '@/store';
import {useQuery, UseQueryOptions} from '@tanstack/react-query';

export type ITerms = {
  id: number;
  content: string;
  content_ar: string;
};

async function Terms(token?: string) {
  const endpoint = `/info/terms-and-conditions`;
  const res = await axios.get<ITerms>(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export const useTerms = (
  config?: Omit<UseQueryOptions<ITerms, IApiError>, 'queryKey' | 'queryFn'>,
) => {
  const {access_token} = useAppSelector(state => state.local);
  return useQuery({
    queryKey: ['Terms'],
    queryFn: () => Terms(access_token),
    retry: 2,
    ...config,
  });
};
