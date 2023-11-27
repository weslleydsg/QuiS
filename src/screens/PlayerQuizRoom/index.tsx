import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { View } from 'react-native';
import { Headline, Text, Title, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  GetRoom,
  GetRoomQuestions,
  UpdatePlayersAnswer,
} from '~/collections/rooms';
import { MainStack } from '~/types';
import {
  RoomQuestion,
  RoomQuestionAlternativesKeys,
  RoomStatus,
} from '~/types/entity';
import {
  ListenerReturnType,
  playerSessionListener,
} from '~/utils/playerSessionUtils';
import AlternativeButton from './AlternativeButton';
import styles from './styles';

function PlayerQuizRoomScreen(): JSX.Element {
  const navigation =
    useNavigation<NavigationProp<MainStack, 'PlayerQuizRoom'>>();
  const { params } = useRoute<RouteProp<MainStack, 'PlayerQuizRoom'>>();
  const theme = useTheme<GlobalTheme.Theme>();
  const room = GetRoom(params.code, {
    ignoreCache: true,
    refetchWhenCache: true,
  });
  const questions = GetRoomQuestions(params.code);
  const { loading, transactionFn: addAnswer } = UpdatePlayersAnswer();
  const [selectedAlternative, setSelectedAlternative] =
    useState<RoomQuestionAlternativesKeys>();
  const listenerRef = useRef<ListenerReturnType>();
  const currentQuestion = room?.currentQuestion || 0;
  const question = questions[currentQuestion] as RoomQuestion | undefined;

  const onAlternativePress = useCallback(
    async (alternative: RoomQuestionAlternativesKeys) => {
      if (!question?.playersAnswer) {
        return;
      }
      setSelectedAlternative(alternative);
      const questionIndex = currentQuestion;
      const playersAnswers = question.playersAnswer;
      await addAnswer(params.code, questionIndex, {
        ...playersAnswers,
        [params.username]: alternative,
      });
    },
    [
      addAnswer,
      currentQuestion,
      params.code,
      params.username,
      question?.playersAnswer,
    ],
  );

  useLayoutEffect(() => {
    navigation.setOptions({ title: `Quiz: ${params.code}` });
  }, [navigation, params.code]);

  useEffect(() => {
    setSelectedAlternative(undefined);
  }, [currentQuestion]);

  useEffect(() => {
    switch (room?.status) {
      case RoomStatus.waiting:
      case RoomStatus.abandoned:
      case RoomStatus.finished:
        listenerRef.current?.unsubscribe();
        listenerRef.current = undefined;
        navigation.navigate('Home');
        break;
      default:
        break;
    }
  }, [navigation, room?.status]);

  useEffect(() => {
    return () => {
      console.log('chegou aqui');
      // listenerRef.current?.leavingQuiz();
    };
  }, []);

  useEffect(() => {
    if (
      room?.status === RoomStatus.waiting ||
      room?.status === RoomStatus.abandoned ||
      room?.status === RoomStatus.finished
    ) {
      return undefined;
    }
    listenerRef.current = playerSessionListener(params.code, params.username);
    return () => {
      // listenerRef.current?.leavingQuiz();
      listenerRef.current?.unsubscribe();
      listenerRef.current = undefined;
    };
  }, [params.code, params.username, room?.status]);

  return (
    <SafeAreaView
      style={[styles.screen, { margin: theme.spacings.large }]}
      edges={['right', 'bottom', 'left']}>
      {!question || room?.status === RoomStatus.waiting ? (
        <Headline
          style={[
            styles.headline,
            {
              marginBottom: theme.spacings.small,
              color: theme.colors.tertiary,
            },
          ]}>
          Aguarde a partida começar!
        </Headline>
      ) : (
        <>
          <Title style={{ marginBottom: theme.spacings.large }}>
            {question.description}
          </Title>
          <Text>{`A) ${question.alternatives.a}`}</Text>
          <Text>{`B) ${question.alternatives.b}`}</Text>
          <Text>{`C) ${question.alternatives.c}`}</Text>
          <Text>{`D) ${question.alternatives.d}`}</Text>
          <View
            style={{
              marginTop: theme.spacings.big,
              flexDirection: 'row',
              flexGrow: 1,
            }}>
            <AlternativeButton
              alternative={RoomQuestionAlternativesKeys.a}
              selected={selectedAlternative}
              loading={loading}
              backgroundColor={theme.colors.primary}
              onPress={onAlternativePress}
            />
            <AlternativeButton
              alternative={RoomQuestionAlternativesKeys.b}
              selected={selectedAlternative}
              loading={loading}
              backgroundColor={theme.colors.secondary}
              onPress={onAlternativePress}
            />
          </View>
          <View style={{ flexDirection: 'row', flexGrow: 1 }}>
            <AlternativeButton
              alternative={RoomQuestionAlternativesKeys.c}
              selected={selectedAlternative}
              loading={loading}
              backgroundColor={theme.colors.tertiary}
              onPress={onAlternativePress}
            />
            <AlternativeButton
              alternative={RoomQuestionAlternativesKeys.d}
              selected={selectedAlternative}
              loading={loading}
              backgroundColor={theme.colors.error}
              onPress={onAlternativePress}
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

export default PlayerQuizRoomScreen;
