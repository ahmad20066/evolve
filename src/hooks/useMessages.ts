import {axios, IApiError} from '@/hooks/axios.config';
import {useAppSelector} from '@/store';
import {IMessage} from '@/types/messages';
import {IMealsMy} from '@/types/myMeal';
import {useQuery, UseQueryOptions} from '@tanstack/react-query';

export type IMessages = {
  id: 6;
  user_id: number;
  coach_id: number;
  messages: IMessage[];
  coach: {email: string; id: number; name: string};
};

async function getMessages(token?: string) {
  const endpoint = `/chat/messages`;
  const res = await axios.get<IMessages>(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export const useMessages = (
  config?: Omit<UseQueryOptions<IMessages, IApiError>, 'queryKey' | 'queryFn'>,
) => {
  const {access_token} = useAppSelector(state => state.local);
  return useQuery({
    queryKey: ['messages'],
    queryFn: () => getMessages(access_token),
    retry: 2,
    ...config,
  });
};
