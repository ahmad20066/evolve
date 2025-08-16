import {MutationOptions, useMutation} from '@tanstack/react-query';
import {axios, IApiError} from './axios.config';
import {useAppSelector} from '@/store';
import FormData from 'form-data';

export interface ISendChatArgs {
  content?: string;
  file?: any;
}

export type ISendChatResult = {
  message: {
    is_read: boolean;
    id: number;
    chat_id: number;
    sender_id: number;
    content: string;
  };
};

async function SendChat(args: ISendChatArgs, access_token?: string) {
  const endpoint = `/chat/message`;
  const formData = new FormData();

  if (args.content) {
    formData.append('content', args.content);
  }
  if (args.file) {
    formData.append('file', args.file);
  }

  const res = await axios.post<ISendChatResult>(endpoint, formData, {
    headers: {
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
}

export const useSendChat = (
  config: MutationOptions<ISendChatResult, IApiError, ISendChatArgs>,
) => {
  const {access_token} = useAppSelector(state => state.local);
  return useMutation<ISendChatResult, IApiError, ISendChatArgs>({
    mutationFn: (args: ISendChatArgs) => SendChat(args, access_token),
    ...config,
  });
};
