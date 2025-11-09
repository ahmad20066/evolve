import {AppNavigationProps} from '@/navigators/navigation';
import {globalStyles} from '@/styles/globalStyles';
import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import Back from '@/assets/svg/arrow-left.svg';
import RoundButton from '@/components/roundButton';
import {Text, theme} from '@/components/theme';
import Badge from './components/badge';
import {useLeaderboard} from '@/hooks/useLeaderBoard';

const Leaderboard = ({
  navigation,
  route,
}: AppNavigationProps<'Leaderboard'>) => {
  const {id, label} = route.params;
  const {data} = useLeaderboard(id);

  const rank1 = data?.find(item => item.rank === 1);
  const rank2 = data?.find(item => item.rank === 2);
  const rank3 = data?.find(item => item.rank === 3);

  // New ordered array: Rank 2 → Rank 1 → Rank 3
  const topRanks = [rank2, rank1, rank3]
    .filter(Boolean) // Remove undefined values
    .map(item => ({...item}));
  const bottomRanks = data?.filter(item => item.rank >= 4 && item.rank <= 10);

  const getColor2 = (rank: number): string => {
    switch (rank) {
      case 1:
        return '#EEF5FF';
      case 2:
        return '#FFEFEA';
      case 3:
        return '#FCFFF1';
      default:
        return '#FFF0C5';
    }
  };

  const mainColor = (rank: number): string => {
    switch (rank) {
      case 1:
        return theme.colors.apptheme;
      case 2:
        return theme.colors.second;
      case 3:
        return theme.colors.lightGreen;
      default:
        return theme.colors.rank;
    }
  };

  const textColor = (rank: number): string => {
    switch (rank) {
      case 1:
        return 'apptheme';
      case 2:
        return 'second';
      case 3:
        return 'lightGreen';
      default:
        return 'gray';
    }
  };

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
          {label}
        </Text>
        <View />
      </View>

      <View style={styles.leaderboardContainer}>
        {topRanks?.map(item => (
          <View
            key={item.rank}
            style={[
              styles.card,
              globalStyles.shadow,
              item.rank === 1
                ? styles.firstPlace
                : item.rank === 2
                ? styles.secondPlace
                : styles.thirdPlace,
            ]}>
            <Image
              source={require('@/assets/images/workout.png')}
              style={styles.rankers}
            />
            <Text mt="s" variant="poppins12black_medium">
              {item.user?.name}
            </Text>
            <Text mt="xs" variant="poppins12black_medium" color="gray">
              {item.stats?.weight} KG
            </Text>
            <View style={styles.rank}>
              <Badge
                maincolor={mainColor(item.rank!)}
                color2={getColor2(item.rank!)}>
                <Text
                  variant="poppins14black_bold"
                  color={textColor(item.rank!) as any}>
                  {item.rank}
                </Text>
              </Badge>
            </View>
          </View>
        ))}
      </View>
      {bottomRanks && bottomRanks?.length > 0 && (
        <Text mt="xl" variant="poppins16black_medium" marginVertical="m">
          Ranking
        </Text>
      )}
      {bottomRanks?.map(item => (
        <View style={[globalStyles.line2, globalStyles.shadow, styles.item]}>
          <View style={globalStyles.line}>
            <Badge
              maincolor={mainColor(item.rank)}
              color2={getColor2(item.rank)}>
              <Text variant="poppins14black_bold" color="rank">
                {item.rank}
              </Text>
            </Badge>
            <Text ms="m" variant="poppins12black_medium">
              {item.user.name}
            </Text>
          </View>
          <Text ms="m" variant="poppins12black_medium" color="gray">
            {item.stats.weight} KG
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {padding: '5%'},
  rankBadge: {
    position: 'absolute',
    bottom: -10,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rank: {position: 'absolute', bottom: -15},
  rankText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  card: {
    width: 109,
    height: 128,
    backgroundColor: '#FFF',
    alignItems: 'center',
    borderRadius: 12,
    justifyContent: 'center',
  },
  rankers: {width: 40, height: 40, borderRadius: 20},
  item: {
    height: 54,
    borderRadius: 12,
    paddingHorizontal: '5%',
    marginBottom: '3%',
  },
  firstPlace: {
    marginBottom: '10%',
  },
  secondPlace: {
    marginRight: 20,
  },
  thirdPlace: {
    marginLeft: 20,
  },
  leaderboardContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: '100%',
    marginTop: '5%',
  },
});

export default Leaderboard;
