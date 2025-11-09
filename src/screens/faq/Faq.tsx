import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import Back from '@/assets/svg/arrow-left.svg';
import RoundButton from '@/components/roundButton';
import {globalStyles} from '@/styles/globalStyles';
import {Text, theme} from '@/components/theme';
import {useTranslation} from 'react-i18next';
import {AppNavigationProps} from '@/navigators/navigation';
import {useFAQ} from '@/hooks/useFAQ';
import Accordian from './components/accordian';

const Faq = ({navigation}: AppNavigationProps<'Faq'>) => {
  const {t} = useTranslation();
  const {data} = useFAQ();
  return (
    <View style={[globalStyles.container, styles.container]}>
      <View style={globalStyles.line2}>
        <RoundButton onPress={() => navigation.goBack()}>
          <Back color={theme.colors.black} />
        </RoundButton>
        <Text
          textTransform="uppercase"
          variant="poppins18black_semibold"
          me="s">
          {t('faq')}
        </Text>
        <View />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {data?.map(item => (
          <Accordian key={item.id} item={item} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {padding: '5%'},
});

export default Faq;
