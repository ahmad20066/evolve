import {globalStyles} from '@/styles/globalStyles';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import Back from '@/assets/svg/arrow-left.svg';
import RoundButton from '@/components/roundButton';
import {Text, theme} from '@/components/theme';
import {AppNavigationProps} from '@/navigators/navigation';
import {useTranslation} from 'react-i18next';
import {usePrivacyPolicy} from '@/hooks/usePrivacyPolicy';
import {useTerms} from '@/hooks/useTerms';
import WebView from 'react-native-webview';

const TermsnPolicy = ({
  navigation,
  route,
}: AppNavigationProps<'TermsnPolicy'>) => {
  const {policy} = route.params;
  const {t, i18n} = useTranslation();
  const {data: privacyPolicy} = usePrivacyPolicy();
  const {data: terms} = useTerms();
  return (
    <View style={globalStyles.container}>
      <View style={[globalStyles.line2, styles.margin]}>
        <RoundButton onPress={() => navigation.goBack()}>
          <Back color={theme.colors.black} />
        </RoundButton>
        <Text variant="poppins18black_semibold" me="s">
          {policy ? t('privacy_policy') : t('terms')}
        </Text>
        <View />
      </View>
      <WebView
        originWhitelist={['*']}
        source={{
          html: policy
            ? i18n.language === 'ar'
              ? privacyPolicy?.content_ar ?? ''
              : privacyPolicy?.content ?? ''
            : i18n.language === 'ar'
            ? terms?.content_ar ?? ''
            : terms?.content ?? '',
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  margin: {padding: '5%'},
});

export default TermsnPolicy;
