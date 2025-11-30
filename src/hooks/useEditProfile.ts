import { MutationOptions, useMutation } from "@tanstack/react-query";
import { axios, IApiError } from "./axios.config";
import { useAppSelector } from "@/store";

export interface IEditProfileArgs {
  name: string;
  email: string;
  phone: string;
  dob: string;
  // React Native image file
  profile_image?: {
    uri: string;
    name?: string;
    type?: string;
  } | null;
}

export type IEditProfileResult = {
  message: string;
};

async function EditProfile(args: IEditProfileArgs, access_token?: string) {
  const endpoint = `/profile/update`;
  const formData = new FormData();
  // Append scalar fields
  formData.append("name", args.name);
  formData.append("email", args.email);
  formData.append("phone", args.phone);
  formData.append("dob", args.dob);

  // Append image if provided
  if (args.profile_image?.uri) {
    // @ts-ignore: React Native FormData supports objects with uri/name/type
    formData.append("profile_image", {
      uri: args.profile_image.uri,
      name: args.profile_image.name || "profile.jpg",
      type: args.profile_image.type || "image/jpeg",
    });
  }
  const res = await axios.put<IEditProfileResult>(endpoint, formData, {
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
}

export const useEditProfile = (
  config: MutationOptions<IEditProfileResult, IApiError, IEditProfileArgs>
) => {
  const { access_token } = useAppSelector((state) => state.local);
  return useMutation<IEditProfileResult, IApiError, IEditProfileArgs>({
    mutationFn: (args: IEditProfileArgs) => EditProfile(args, access_token),
    ...config,
  });
};
