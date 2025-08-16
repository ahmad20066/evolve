import {Text, theme} from '@/components/theme';
import {IFAQ} from '@/hooks/useFAQ';
import RNBounceable from '@freakycoder/react-native-bounceable';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import ArrowTop from '@/assets/svg/arrow-top.svg';
import Down from '@/assets/svg/arrow-down.svg';
import {globalStyles} from '@/styles/globalStyles';

interface accordianProps {
  item: IFAQ;
}

const Accordian = ({item}: accordianProps) => {
  const {i18n} = useTranslation();
  const [expanded, setExpanded] = useState(false);
  return (
    <View>
      <RNBounceable
        style={[globalStyles.line2, styles.item]}
        onPress={() => setExpanded(!expanded)}>
        <Text
          variant="poppins14black_semibold"
          color={expanded ? 'apptheme' : 'black'}>
          {i18n.language == 'ar' ? item.question_ar : item.question}
        </Text>
        {expanded ? <ArrowTop /> : <Down />}
      </RNBounceable>
      {expanded && (
        <Text
          marginHorizontal="s"
          textAlign="left"
          mt="m"
          variant="poppins12black_regular"
          color="gray">
          {i18n.language == 'ar' ? item.answer_ar : item.answer}
        </Text>
      )}
      <View style={styles.greyLine} />
    </View>
  );
};

const styles = StyleSheet.create({
  item: {marginTop: '5%', marginHorizontal: '2%'},
  greyLine: {
    height: 1,
    backgroundColor: theme.colors.softGray,
    marginTop: '7%',
  },
});

export default Accordian;
