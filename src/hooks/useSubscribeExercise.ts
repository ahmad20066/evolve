import { MutationOptions, useMutation } from "@tanstack/react-query";
import { axios, IApiError } from "./axios.config";
import { useAppSelector } from "@/store";

export interface ISubscribeExerciseArgs {
  package_id: number | undefined;
  pricing_id: number | undefined;
  coupon_code: string | undefined;
  payment_method: "tap" | "iap";
  app_user_id?: string;
  apple_receipt?: string;
  expected_entitlement?: string;
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
  console.log({ args });

  const endpoint = ``;
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
