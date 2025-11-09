import {axios, IApiError} from '@/hooks/axios.config';
import {useAppSelector} from '@/store';
import {useQuery, UseQueryOptions} from '@tanstack/react-query';

export type ILeaderboard = {
  user: {
    id: number;
    name: string;
  };
  stats: {
    reps: number;
    weight: number;
  };
  rank: number;
};

async function Leaderboard(id: number, token?: string) {
  const endpoint = `/fitness/leader-board?exercise_id=${id}`;
  const res = await axios.get<ILeaderboard[]>(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export const useLeaderboard = (
  id: number,
  config?: Omit<
    UseQueryOptions<ILeaderboard[], IApiError>,
    'queryKey' | 'queryFn'
  >,
) => {
  const {access_token} = useAppSelector(state => state.local);
  return useQuery({
    queryKey: ['Leaderboard', id],
    queryFn: () => Leaderboard(id, access_token),
    retry: 2,
    ...config,
  });
};
