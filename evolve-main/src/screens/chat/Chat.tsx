import React, {useCallback, useEffect, useMemo, useState} from 'react';
import Back from '@/assets/svg/arrow-left.svg';
import {Platform, StyleSheet, View} from 'react-native';
import {globalStyles} from '@/styles/globalStyles';
import RoundButton from '@/components/roundButton';
import {AppNavigationProps} from '@/navigators/navigation';
import {Text, theme} from '@/components/theme';
import {useOnMessage, useSocket} from '@/hooks/useSocket';
import {useAppSelector} from '@/store';
import {
  Bubble,
  GiftedChat,
  IMessage,
  InputToolbar,
  Send,
} from 'react-native-gifted-chat';
import SendIcon from '@/assets/svg/send.svg';
import Plus from '@/assets/svg/plus.svg';
import RNBounceable from '@freakycoder/react-native-bounceable';
import {useMessages} from '@/hooks/useMessages';
import {useSendChat} from '@/hooks/useSendChat';
import {showToast} from '@/components/toast';
import {useTranslation} from 'react-i18next';
import {Image} from 'react-native-svg';
import ImageUpload from '@/components/imageUpload';

const Chat = ({navigation}: AppNavigationProps<'Chat'>) => {
  const {t} = useTranslation();
  const {access_token} = useAppSelector(state => state.local);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [pic, setpic] = useState<any>();
  const {data} = useMessages();

  const {mutate} = useSendChat({
    onError() {
      showToast('errorToast', 'Something went wrong', 'top');
    },
  });

  const currentUserId = useMemo(() => data?.user_id ?? '', [data]);
  useEffect(() => {
    if (data?.messages) {
      const formattedMessages = data.messages
        .map((msg: any) => ({
          _id: msg.id,
          text:
            typeof msg.content === 'string'
              ? msg.content
              : JSON.stringify(msg.content),
          createdAt: new Date(msg.createdAt),
          user: {
            _id: msg.sender_id,
            name: msg.userName,
            avatar: msg.userAvatar,
          },
        }))
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); // Newest first

      setMessages(formattedMessages);
    }
  }, [data]);
  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );
  }, []);

  const web_socket = useSocket({
    enabled: true,
    debugName: 'chat WS',
    endpoint: 'wss://api.evolvevw.com',
    init(ws) {
      ws.send(JSON.stringify({type: 'authenticate', token: access_token}));
    },
  });

  useOnMessage({
    socket: web_socket,
    onMessage(data) {},
  });
  return (
    <View style={[globalStyles.container]}>
      <View style={[globalStyles.line, styles.container]}>
        <RoundButton onPress={() => navigation.goBack()}>
          <Back color={theme.colors.black} />
        </RoundButton>
        <Text ms="l" variant="poppins16black_semibold">
          {data?.coach == null ? t('wait_coach') : data?.coach.name}
        </Text>
      </View>
      <GiftedChat
        messages={messages}
        onSend={(messages: any) => {
          onSend(messages), mutate({content: messages?.[0].text});
        }}
        user={{
          _id: currentUserId ?? '', // this is important
        }}
        renderAvatar={null}
        renderBubble={props => {
          return (
            <Bubble
              {...props}
              textStyle={{
                right: styles.rightText,
                left: styles.leftText,
              }}
              wrapperStyle={{
                right: styles.rightBubble,
                left: styles.leftBubble,
              }}
            />
          );
        }}
        renderSend={props => (
          <View style={styles.sendcontainer}>
            <Send {...props}>
              <View style={styles.send}>
                <SendIcon />
              </View>
            </Send>
          </View>
        )}
        textInputProps={styles.input}
        renderInputToolbar={props => (
          <InputToolbar
            {...props}
            containerStyle={styles.box}
            renderActions={() => <ImageUpload onSelect={e => setpic(e)} />}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {backgroundColor: theme.colors.input, padding: '5%'},
  rightText: {
    color: theme.colors.white,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  box: {
    borderTopWidth: 0,
    backgroundColor: theme.colors.screen,
    marginVertical: '2%',
  },
  sendcontainer: {
    justifyContent: 'center',
    height: 60,
    marginHorizontal: 10,
  },
  leftText: {
    color: theme.colors.gray,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  input: {
    borderRadius: 8,
    backgroundColor: theme.colors.input,
    height: 56,
    width: 230,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    paddingStart: 20,
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
  },
  send: {
    backgroundColor: theme.colors.lightGreen,
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },

  rightBubble: {
    backgroundColor: theme.colors.apptheme,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 16,
    padding: 10,
    marginBottom: '1%',
    marginRight: '3%',
  },
  leftBubble: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: 10,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 0,
    marginBottom: '1%',
    marginLeft: '3%',
  },
});

export default Chat;
