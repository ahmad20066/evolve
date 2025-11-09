import {axios, IApiError} from '@/hooks/axios.config';
import {useQuery, UseQueryOptions} from '@tanstack/react-query';
import useDebounce from './useDebounce';

export type IMapAddress = {
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

async function MapAddress(
  latitude: number,
  longitude: number,
  myApiKey: string,
) {
  const endpoint = `https://maps.googleapis.com/maps/api/geocode/json?address=${latitude},${longitude}&key=${myApiKey}`;
  const res = await axios.get<IMapAddress[]>(endpoint);
  return res.data;
}

export const useMapAddress = (
  api_key: string,
  latitude: number,
  longitude: number,
  config?: Omit<
    UseQueryOptions<IMapAddress[], IApiError>,
    'queryKey' | 'queryFn'
  >,
) => {
  const debouncedLatitude = useDebounce(latitude, 500);
  const debouncedLongitude = useDebounce(longitude, 500);
  return useQuery({
    queryKey: ['MapAddress', api_key, debouncedLatitude, debouncedLongitude],
    queryFn: () => MapAddress(debouncedLatitude, debouncedLongitude, api_key),
    retry: 2,
    ...config,
  });
};
