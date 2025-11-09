export type IMealsMy = {
  meal: {
    images: string[];
    id: number;
    name: string;
    name_ar: string;
    description: string;
    description_ar: string;
    calories: number;
    types: {
      id: number;
      title: string;
      title_ar: string;
    }[];
  };
  selection_id: number;
  type: string;
};
