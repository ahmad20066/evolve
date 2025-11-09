export type IMealsofWeek = {
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
  createdAt: string;
  updatedAt: string;
  types: [
    {
      id: number;
      title: string;
    },
  ];
};
