import {axios, IApiError} from '@/hooks/axios.config';
import {useAppSelector} from '@/store';
import {useQuery, UseQueryOptions} from '@tanstack/react-query';

export type IFAQ = {
  id: number;
  question: string;
  question_ar: string;
  answer: string;
  answer_ar: string;
};

async function getFAQ(token?: string) {
  const endpoint = `/info/faqs`;
  const res = await axios.get<IFAQ[]>(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export const useFAQ = (
  config?: Omit<UseQueryOptions<IFAQ[], IApiError>, 'queryKey' | 'queryFn'>,
) => {
  const {access_token} = useAppSelector(state => state.local);
  return useQuery({
    queryKey: ['FAQ'],
    queryFn: () => getFAQ(access_token),
    retry: 2,
    ...config,
  });
};
