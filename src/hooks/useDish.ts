import {axios, IApiError} from '@/hooks/axios.config';
import {useAppSelector} from '@/store';
import {useQuery, UseQueryOptions} from '@tanstack/react-query';

export type IDish = {
  id: number;
  name: string;
  name_ar: string;
  description: string;
  description_ar: string;
  calories: number;
  images: string[];
  protein: number;
  fats: number;
  fiber: number;
  carb: number;
  createdAt: symbol;
  updatedAt: string;
  types: [
    {
      id: number;
      title: string;
      createdAt: '2024-12-20T10:13:42.000Z';
      updatedAt: '2024-12-20T10:13:42.000Z';
    },
  ];
  ingredients: {
    id: number;
    title: string;
    title_ar: string;
    image: string;
    unit: string;
    quantity: number;
  }[];
};

async function getDish(id: number, token?: string) {
  const endpoint = `/diet/meal/${id}`;
  const res = await axios.get<IDish>(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export const useDish = (
  id: number,
  config?: Omit<UseQueryOptions<IDish, IApiError>, 'queryKey' | 'queryFn'>,
) => {
  const {access_token} = useAppSelector(state => state.local);
  return useQuery({
    queryKey: ['dish', id],
    queryFn: () => getDish(id, access_token),
    retry: 2,
    ...config,
  });
};
