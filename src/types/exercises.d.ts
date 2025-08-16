export type IExercise = {
  image_urls: string[];
  notes: string[];
  id: number;
  name: string;
  name_ar: string;
  description: string;
  target_muscles_image: string;
  video_url: string;
  is_active: boolean;
  status: string;
  stats: {
    sets: number;
    reps: number;
    duration: number;
  };
};
