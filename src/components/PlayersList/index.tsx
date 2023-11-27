import { RouteProp, useRoute } from '@react-navigation/native';
import React, { memo, useCallback, useMemo } from 'react';
import { FlatList, ListRenderItemInfo, View } from 'react-native';
import { Headline, Title, useTheme } from 'react-native-paper';
import PlayerItem from '~/components/PlayerItem';
import { MainStack } from '~/types';
import { RoomPlayer, RoomQuestion } from '~/types/entity';
import styles from './styles';

interface PlayerWithProgress extends RoomPlayer {
  progress?: number;
}

interface Props {
  players: RoomPlayer[];
  currentQuestion?: number;
  questions?: RoomQuestion[];
}

function PlayersList({
  players,
  currentQuestion,
  questions,
}: Props): JSX.Element {
  const { params } = useRoute<RouteProp<MainStack, 'PlayerWaitingRoom'>>();
  const theme = useTheme<GlobalTheme.Theme>();

  const ListEmptyComponent = (
    <View style={styles.emptyComponentContainer}>
      <Headline>Convide jogadores!</Headline>
    </View>
  );
  const ListHeaderComponent =
    players.length === 0 ? null : (
      <Title style={{ marginBottom: theme.spacings.large }}>Jogadores:</Title>
    );

  const playersWithQuizProgress = useMemo<PlayerWithProgress[]>(() => {
    if (!questions || questions.length === 0 || currentQuestion === undefined) {
      return players;
    }
    const playersWithProgress = players.map<PlayerWithProgress>((player) => {
      let answeredQuestionsQuantity = 0;
      let countCorrectAlternatives = 0;
      for (let i = 0; i < currentQuestion + 1; i += 1) {
        const question = questions[i];
        const playersAnswer = question.playersAnswer[player.username];
        if (playersAnswer) {
          answeredQuestionsQuantity += 1;
          if (playersAnswer === question.correctAlternative) {
            countCorrectAlternatives += 1;
          }
        }
      }
      if (answeredQuestionsQuantity < 1) {
        return player;
      }
      const progress =
        countCorrectAlternatives === 0
          ? 0
          : (countCorrectAlternatives / answeredQuestionsQuantity) * 100;
      return { ...player, progress };
    });
    return playersWithProgress.sort(
      ({ progress: aProgress = 100 }, { progress: bProgress = 100 }) =>
        bProgress - aProgress,
    );
  }, [currentQuestion, players, questions]);

  const renderItem = useCallback(
    ({
      item: { username, quizStatus, progress },
    }: ListRenderItemInfo<PlayerWithProgress>) => {
      return (
        <PlayerItem
          username={username}
          self={params.username === username}
          quizStatus={quizStatus}
          progress={progress}
        />
      );
    },
    [params.username],
  );

  return (
    <FlatList
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={ListEmptyComponent}
      data={playersWithQuizProgress}
      contentContainerStyle={[
        styles.ListContent,
        {
          paddingVertical: theme.spacings.big,
        },
      ]}
      renderItem={renderItem}
    />
  );
}

export default memo(PlayersList);
