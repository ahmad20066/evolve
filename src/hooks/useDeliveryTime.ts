import {axios, IApiError} from '@/hooks/axios.config';
import {useAppSelector} from '@/store';
import {useQuery, UseQueryOptions} from '@tanstack/react-query';

interface IDelivertTime {
  id: number;
  title: string;
  title_ar: string;
  createdAt: string;
  updatedAt: string;
}
async function getDeliveryTimes(token?: string) {
  const endpoint = `/diet/delivery-time`;
  const res = await axios.get<IDelivertTime[]>(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export const useDeliveryTimes = (
  config?: Omit<
    UseQueryOptions<IDelivertTime[], IApiError>,
    'queryKey' | 'queryFn'
  >,
) => {
  const {access_token} = useAppSelector(state => state.local);
  return useQuery({
    queryKey: ['delivery-times'],
    queryFn: () => getDeliveryTimes(access_token),
    retry: 2,
    ...config,
  });
};
