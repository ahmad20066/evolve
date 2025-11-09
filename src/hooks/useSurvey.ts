import {axios, IApiError} from '@/hooks/axios.config';
import {useAppSelector} from '@/store';
import {useQuery, UseQueryOptions} from '@tanstack/react-query';

export type ISurvey = {
  id: number;
  title: string;
  package_id: number;
  questions: [
    {
      id: number;
      title: string;
      image: string;
      type: string;
      survey_id: number;
      choices: {
        id: number;
        text: string;
        question_id: number;
      }[];
    },
  ];
};

async function Survey(token?: string) {
  const endpoint = `/profile/me`;
  const res = await axios.get<ISurvey>(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export const useSurvey = (
  config?: Omit<UseQueryOptions<ISurvey, IApiError>, 'queryKey' | 'queryFn'>,
) => {
  const {access_token} = useAppSelector(state => state.local);
  return useQuery({
    queryKey: ['survey'],
    queryFn: () => Survey(access_token),
    retry: 2,
    ...config,
  });
};
