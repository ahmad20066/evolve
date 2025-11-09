import {axios, IApiError} from '@/hooks/axios.config';
import {useAppSelector} from '@/store';
import {useQuery, UseQueryOptions} from '@tanstack/react-query';

export type WeightChange = {
  date: string;
  weight: number;
};

export type ExerciseStatSummary = {
  exercise: string;
  totalWeight: number | null;
};

export type RecentWorkout = {
  title: string;
  date: string;
  duration: number;
  attendedAt: string;
};

export type RecentExercise = {
  name: string;
  completedAt: string;
};

export type RecentActivity = {
  workouts: RecentWorkout[];
  exercises: RecentExercise[];
};

export type IPerformanceStats = {
  weightChange: WeightChange[];
  totalWorkoutAttendance: number;
  distinctWorkouts: number;
  totalExerciseCompletion: number;
  distinctExercises: number;
  totalWorkoutCompletion: number;
  exerciseStatSummary: ExerciseStatSummary[];
  recentActivity: RecentActivity;
};

export type IPerformanceStatsResponse = {
  message: string;
  stats: IPerformanceStats;
};

async function getPerformanceStats(token?: string) {
  const endpoint = `/fitness/diary`;
  const res = await axios.get<IPerformanceStatsResponse>(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.stats;
}

export const usePerformanceStats = (
  config?: Omit<
    UseQueryOptions<IPerformanceStats, IApiError>,
    'queryKey' | 'queryFn'
  >,
) => {
  const {access_token} = useAppSelector(state => state.local);
  return useQuery({
    queryKey: ['performance-stats'],
    queryFn: () => getPerformanceStats(access_token),
    retry: 2,
    ...config,
  });
};

