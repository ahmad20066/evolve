import {globalStyles} from '@/styles/globalStyles';
import React, {useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import Right from '@/assets/svg/smallright.svg';
import {Text, theme} from '@/components/theme';
import RNBounceable from '@freakycoder/react-native-bounceable';
import BaseButton from '@/components/baseBtn';
import {AppNavigationProps} from '@/navigators/navigation';
import WorkoutSelector from '@/components/workoutSelector';
import PackageSkeleton from '@/components/packageSkeleton';
import {IWorkoutPlans, useWorkoutPlans} from '@/hooks/useWorkoutPlans';
import {useTranslation} from 'react-i18next';
import {IPricing} from '@/types/pricing';
import {showToast} from '@/components/toast';

const WorkoutPlan = ({navigation}: AppNavigationProps<'WorkoutPlan'>) => {
  const {t, i18n} = useTranslation();
  const [active, setActive] = useState<number>();
  const {data, isPending} = useWorkoutPlans();
  const [item, setItem] = useState<IWorkoutPlans | undefined>();
  const handleItemClicked = React.useCallback((item: IWorkoutPlans) => {
    setItem(item);
  }, []);
  return (
    <View style={globalStyles.container}>
      <View style={styles.container}>
        <View style={[globalStyles.line2, styles.margin]}>
          <Text variant="poppins18black_semibold">{t('choose_fitness')}</Text>
          <RNBounceable
            style={globalStyles.line}
            onPress={() => navigation.navigate('Exercises', {id: active!})}>
            <Text me="s" variant="poppins14black_regular" color="gray">
              {t('show_exercises')}
            </Text>
            <Right color={theme.colors.black} />
          </RNBounceable>
        </View>
      </View>
      <View>
        <ScrollView showsHorizontalScrollIndicator={false} horizontal>
          {isPending ? (
            <PackageSkeleton />
          ) : (
            data?.map((item, index) => (
              <WorkoutSelector
                key={item.id}
                item={item}
                active={active}
                setActive={setActive}
                onItemSelected={handleItemClicked}
                islast={index === data.length - 1}
              />
            ))
          )}
        </ScrollView>
      </View>
      <View style={styles.container}>
        <BaseButton
          label={t('next')}
          onPress={() =>
            item
              ? navigation.navigate('Payment', {
                  package_id: item?.pricings?.[0]?.package_id,
                  pricing_id: item?.id,
                  pay_details: {
                    title: i18n.language == 'ar' ? item?.name_ar : item?.name,
                    price: item?.pricings?.[0]?.price,
                    number_of_days: item?.pricings?.[0]?.number_of_days,
                  },
                })
              : showToast('errorToast', 'Please select a plan', 'top')
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: '5%',
  },
  margin: {marginTop: '5%'},
});

export default WorkoutPlan;
