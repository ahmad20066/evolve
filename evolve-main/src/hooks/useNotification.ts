import {axios, IApiError} from '@/hooks/axios.config';
import {useAppSelector} from '@/store';
import {useQuery, UseQueryOptions} from '@tanstack/react-query';

export type INotification = {
  id: number;
  user_id: number;
  title: number;
  body: number;
  is_read: boolean;
  createdAt: string;
};

async function getNotification(token?: string) {
  const endpoint = `/profile/notifications`;
  const res = await axios.get<INotification[]>(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export const useNotification = (
  config?: Omit<
    UseQueryOptions<INotification[], IApiError>,
    'queryKey' | 'queryFn'
  >,
) => {
  const {access_token} = useAppSelector(state => state.local);
  return useQuery({
    queryKey: ['Notification', access_token],
    queryFn: () => getNotification(access_token),
    retry: 2,
    ...config,
  });
};
