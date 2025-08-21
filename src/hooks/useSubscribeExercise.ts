import { MutationOptions, useMutation } from "@tanstack/react-query";
import { axios, IApiError } from "./axios.config";
import { useAppSelector } from "@/store";

export interface ISubscribeExerciseArgs {
  package_id: number | undefined;
  pricing_id: number | undefined;
  coupon_code: string | undefined;
}

export type ISubscribeExerciseResult = {
  message: string;
  payment_url: string;
  success: boolean;
};

async function SubscribeExercise(
  args: ISubscribeExerciseArgs,
  access_token?: string
) {
  const endpoint = `/payments/subscribe-package`;
  const res = await axios.post<ISubscribeExerciseResult>(endpoint, args, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  return res.data;
}

export const useSubscribeExercise = (
  config: MutationOptions<
    ISubscribeExerciseResult,
    IApiError,
    ISubscribeExerciseArgs
  >
) => {
  const { access_token } = useAppSelector((state) => state.local);
  return useMutation<
    ISubscribeExerciseResult,
    IApiError,
    ISubscribeExerciseArgs
  >({
    mutationFn: (args: ISubscribeExerciseArgs) =>
      SubscribeExercise(args, access_token),
    ...config,
  });
};
