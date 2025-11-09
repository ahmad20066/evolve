import {axios, IApiError} from '@/hooks/axios.config';
import {useAppSelector} from '@/store';
import {useQuery, UseQueryOptions} from '@tanstack/react-query';

export type IPricing = {
  id: number;
  title: string;
  title_ar: string;
  price: number;
  number_of_days: number;
  package_id: number;
  is_active: boolean;
};

export type IPackageStatistics = {
  totalSubscribers: number;
  totalWorkouts: number;
  averageRating: number;
  totalReviews: number;
  completionRate: number;
};

export type IRatingDistribution = {
  5: number;
  4: number;
  3: number;
  2: number;
  1: number;
};

export type IRecentReview = {
  rating: number;
  message: string | null;
  createdAt: string;
};

export type IPackageRatings = {
  average: number;
  count: number;
  distribution: IRatingDistribution;
  recent: IRecentReview[];
};

export type IPackageDetails = {
  id: number;
  name: string;
  name_ar: string;
  description: string;
  description_ar: string;
  type: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  pricings: IPricing[];
  statistics: IPackageStatistics;
  ratings: IPackageRatings;
};

async function getPackageDetails(id: number, token?: string) {
  const endpoint = `/fitness/packages/${id}/details`;
  const res = await axios.get<IPackageDetails>(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export const usePackageDetails = (
  id: number,
  config?: Omit<
    UseQueryOptions<IPackageDetails, IApiError>,
    'queryKey' | 'queryFn'
  >,
) => {
  const {access_token} = useAppSelector(state => state.local);
  return useQuery({
    queryKey: ['package-details', id],
    queryFn: () => getPackageDetails(id, access_token),
    retry: 2,
    enabled: !!id,
    ...config,
  });
};

