import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React, { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { Headline, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GetRoom, GetRoomPlayers } from '~/collections/rooms';
import PlayersList from '~/components/PlayersList';
import { MainStack } from '~/types';
import { RoomStatus } from '~/types/entity';
import {
  ListenerReturnType,
  playerSessionListener,
} from '~/utils/playerSessionUtils';
import styles from './styles';

type GetRoomPlayersOptions = NonNullable<Parameters<typeof GetRoomPlayers>[1]>;

function PlayerWaitingRoomScreen(): JSX.Element {
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
  const listenerRef = useRef<ListenerReturnType>();

  useLayoutEffect(() => {
    navigation.setOptions({ title: `Em espera: ${params.code}` });
  }, [navigation, params.code]);

  useEffect(() => {
    switch (room?.status) {
      case RoomStatus.playing:
        console.log('vai unsub');
        listenerRef.current?.unsubscribe();
        listenerRef.current = undefined;
        navigation.goBack();
        navigation.navigate('PlayerQuizRoom', {
          code: params.code,
          username: params.username,
        });
        break;
      case RoomStatus.finished:
      case RoomStatus.abandoned:
        listenerRef.current?.unsubscribe();
        listenerRef.current = undefined;
        navigation.navigate('Home');
        break;
      default:
        break;
    }
  }, [navigation, params.code, params.username, room?.status]);

  useEffect(() => {
    return () => {
      console.log('chegou aqui');
      // listenerRef.current?.leavingQuiz();
    };
  }, []);

  useEffect(() => {
    if (
      room?.status === RoomStatus.abandoned ||
      room?.status === RoomStatus.finished
    ) {
      return undefined;
    }
    listenerRef.current = playerSessionListener(params.code, params.username);
    return () => {
      listenerRef.current?.unsubscribe(params.username);
      listenerRef.current = undefined;
    };
  }, [params.code, params.username, room?.status]);

  return (
    <SafeAreaView
      style={[styles.screen, { margin: theme.spacings.large }]}
      edges={['right', 'bottom', 'left']}>
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
      <PlayersList players={players} />
    </SafeAreaView>
  );
}

export default PlayerWaitingRoomScreen;
