import { AppState, BackHandler } from 'react-native';
import { updateRoomPlayerQuizStatus } from '~/collections/rooms';
import { Room, RoomPlayer, RoomPlayerQuizStatus } from '~/types/entity';

export interface ListenerReturnType {
  leavingQuiz: () => void;
  rejoinQuiz: () => void;
  unsubscribe: () => void;
}

export const playerSessionListener = (
  roomCode: Room['code'],
  username: RoomPlayer['username'],
): ListenerReturnType => {
  const leavingQuiz = () => {
    console.log('unsuleavingQuizbscribed :>> ');
    updateRoomPlayerQuizStatus(
      roomCode,
      username,
      RoomPlayerQuizStatus.earlyQuit,
    );
    return undefined;
  };

  const rejoinQuiz = () => {
    updateRoomPlayerQuizStatus(roomCode, username, RoomPlayerQuizStatus.active);
  };

  const appStateSubscription = AppState.addEventListener(
    'change',
    (appState) => {
      switch (appState) {
        case 'active':
          rejoinQuiz();
          break;
        case 'background':
          // leavingQuiz();
          break;
        default:
          break;
      }
    },
  );

  const backHandler = BackHandler.addEventListener(
    'hardwareBackPress',
    leavingQuiz,
  );

  return {
    leavingQuiz,
    rejoinQuiz,
    unsubscribe: (aaa) => {
      console.log('aaa :>> ', aaa);
      appStateSubscription.remove();
      backHandler.remove();
    },
  };
};
