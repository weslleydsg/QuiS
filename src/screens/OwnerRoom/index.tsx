import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React, { useEffect, useLayoutEffect, useMemo } from 'react';
import { Button, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  AddQuestionsToRoom,
  GetRoom,
  GetRoomPlayers,
  GetRoomQuestions,
  UpdateRoomCurrentQuestion,
  UpdateRoomStatus,
} from '~/collections/rooms';
import PlayersList from '~/components/PlayersList';
import { MainStack } from '~/types';
import { RoomStatus } from '~/types/entity';
import { questionsBySubjects } from '~/utils/fakeQuestions';
import styles from './styles';

type GetRoomPlayersOptions = NonNullable<Parameters<typeof GetRoomPlayers>[1]>;

function OwnerRoomScreen(): JSX.Element {
  const navigation =
    useNavigation<NavigationProp<MainStack, 'PlayerWaitingRoom'>>();
  const { params } = useRoute<RouteProp<MainStack, 'PlayerWaitingRoom'>>();
  const theme = useTheme<GlobalTheme.Theme>();
  const room = GetRoom(params.code);
  const getRoomPlayersOptions = useMemo<GetRoomPlayersOptions['manipulation']>(
    () => ({
      orderBy: { updatedAt: 'desc' },
    }),
    [],
  );
  const players = GetRoomPlayers(params.code, {
    manipulation: getRoomPlayersOptions,
  });
  const questions = GetRoomQuestions(params.code);
  const { loading: loadingAddQuestions, transactionFn: addQuestions } =
    AddQuestionsToRoom();
  const { loading: loadingUpdateStatus, transactionFn: updateStatus } =
    UpdateRoomStatus();
  const {
    loading: loadingCurrentQuestion,
    transactionFn: updateCurrentQuestion,
  } = UpdateRoomCurrentQuestion();
  const loading =
    loadingAddQuestions || loadingUpdateStatus || loadingCurrentQuestion;
  const isWaiting = room?.status === RoomStatus.waiting;
  const buttonDisabled = isWaiting && players.length === 0;
  const questionsLength = questions.length;
  const currentQuestion = room?.currentQuestion ?? 0;
  const isLastQuestion = currentQuestion === questionsLength - 1;
  let buttonLabel: string;
  if (isWaiting) {
    buttonLabel = 'Iniciar';
  } else if (isLastQuestion) {
    buttonLabel = 'Finalizar';
  } else {
    buttonLabel = `Próxima pergunta: ${currentQuestion + 2}`;
  }

  const handleAction = async () => {
    const { code } = params;
    switch (room?.status) {
      case RoomStatus.waiting:
        {
          const subjectsKey = room?.subjects.toString();
          const fakeQuestions = questionsBySubjects[subjectsKey];
          if (!fakeQuestions) {
            console.log(
              'fake data not found for subjectsKey :>> ',
              subjectsKey,
            );
            return;
          }
          await addQuestions(code, fakeQuestions);
          await updateStatus(code, RoomStatus.playing);
        }
        break;
      case RoomStatus.playing:
        if (isLastQuestion) {
          await updateStatus(code, RoomStatus.finished);
        } else if (room) {
          await updateCurrentQuestion(code, room.currentQuestion + 1);
        }
        break;
      default:
        break;
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({ title: `Em espera: ${params.code}` });
  }, [navigation, params.code]);

  useEffect(() => {
    if (room?.status === RoomStatus.abandoned) {
      navigation.navigate('Home');
    }
  }, [navigation, params.code, params.username, room?.status]);

  useEffect(() => {
    // TODO: update room status to abandoned if owner leaves
  }, []);

  return (
    <SafeAreaView
      style={[styles.screen, { margin: theme.spacings.large }]}
      edges={['right', 'bottom', 'left']}>
      <PlayersList
        players={players}
        currentQuestion={currentQuestion}
        questions={questions}
      />
      {room?.status !== RoomStatus.finished && (
        <Button
          mode="contained"
          uppercase
          loading={loading}
          disabled={buttonDisabled}
          style={[
            {
              marginVertical: theme.spacings.large,
            },
          ]}
          onPress={handleAction}>
          {buttonLabel}
        </Button>
      )}
    </SafeAreaView>
  );
}

export default OwnerRoomScreen;
