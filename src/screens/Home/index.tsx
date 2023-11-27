import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { ScrollView, View } from 'react-native';
import {
  Button,
  Headline,
  HelperText,
  Snackbar,
  TextInput,
  useTheme,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  AddPlayerToRoom,
  GetRoomOnce,
  GetRoomPlayerOnce,
} from '~/collections/rooms';
import { MainStack } from '~/types';
import { RoomStatus } from '~/types/entity';
import styles from './styles';

const ROOM_CODE_INVALID_LENGTH = 'O código deve ter 6 caracteres.';
const NO_ROOM_FOUND_ERROR = 'Sala não encontrada.';
const USERNAME_ALREADY_TAKEN = 'Esse nome de usuário já está em uso.';
const ROOM_PLAYING_ERROR = 'Essa sala já está em jogo.';
const ROOM_UNAVAILABLE_ERROR = 'Essa sala não está mais disponível.';

function HomeScreen(): JSX.Element {
  const navigation = useNavigation<NavigationProp<MainStack>>();
  const theme = useTheme<GlobalTheme.Theme>();
  const { loading: getRoomLoading, transactionFn: getRoom } = GetRoomOnce();
  const { loading: getRoomPlayerLoading, transactionFn: getRoomPlayer } =
    GetRoomPlayerOnce();
  const { loading: addPlayerLoading, transactionFn: addPlayerToRoom } =
    AddPlayerToRoom();
  const [username, setUsername] = React.useState('');
  const [usernameErrorMessage, setUsernameErrorMessage] = React.useState('');
  const [roomCode, setRoomCode] = React.useState('');
  const [roomCodeErrorMessage, setRoomCodeErrorMessage] = React.useState('');
  const [snackbarErrorMessage, setSnackbarErrorMessage] = React.useState('');
  const loading = getRoomLoading || getRoomPlayerLoading || addPlayerLoading;
  const searchButtonDisabled = loading || !roomCode || !username;

  const submit = async () => {
    setRoomCodeErrorMessage('');
    setUsernameErrorMessage('');
    if (roomCode.length !== 6) {
      setRoomCodeErrorMessage(ROOM_CODE_INVALID_LENGTH);
      return;
    }
    const parsedRoomCode = roomCode.toLowerCase();
    const room = await getRoom(parsedRoomCode);
    if (!room) {
      setRoomCodeErrorMessage(NO_ROOM_FOUND_ERROR);
      return;
    }
    const parsedUsername = username.toLowerCase();
    const usernameTaken = !!(await getRoomPlayer(
      parsedRoomCode,
      parsedUsername,
    ));
    if (usernameTaken) {
      setUsernameErrorMessage(USERNAME_ALREADY_TAKEN);
      return;
    }
    switch (room.status) {
      case RoomStatus.waiting:
        await addPlayerToRoom(parsedRoomCode, parsedUsername);
        setRoomCode('');
        setSnackbarErrorMessage('');
        navigation.navigate('PlayerWaitingRoom', {
          code: parsedRoomCode,
          username: parsedUsername,
        });
        break;
      case RoomStatus.playing:
        setSnackbarErrorMessage(ROOM_PLAYING_ERROR);
        break;
      case RoomStatus.abandoned:
      case RoomStatus.finished:
      default:
        setSnackbarErrorMessage(ROOM_UNAVAILABLE_ERROR);
        break;
    }
  };

  const navigateToCreateRoom = () => {
    navigation.navigate('CreateRoom');
  };

  return (
    <SafeAreaView
      style={[styles.screen, { margin: theme.spacings.large }]}
      edges={['right', 'bottom', 'left']}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollView}>
        <Headline
          style={[
            styles.headline,
            {
              marginTop: theme.spacings.large,
              color: theme.colors.tertiary,
            },
          ]}>
          Bem-vindo!
        </Headline>
        <View style={styles.searchRoomContainer}>
          <TextInput
            label="Código da Sala"
            placeholder="Digite o código da sala"
            value={roomCode}
            error={!!roomCodeErrorMessage}
            onChangeText={(text) => {
              setRoomCode(text.trim());
            }}
          />
          <HelperText type="error" visible={!!roomCodeErrorMessage}>
            {roomCodeErrorMessage}
          </HelperText>
          <TextInput
            label="Nome de usuário"
            placeholder="Digite o seu nome de usuário"
            value={username}
            error={!!usernameErrorMessage}
            onChangeText={(text) => {
              setUsername(text.trim());
            }}
            onSubmitEditing={submit}
          />
          <HelperText type="error" visible={!!usernameErrorMessage}>
            {usernameErrorMessage}
          </HelperText>
          <Button
            mode="contained"
            loading={loading}
            disabled={searchButtonDisabled}
            uppercase
            style={[
              styles.searchRoomButton,
              {
                marginTop: theme.spacings.large,
              },
            ]}
            onPress={submit}>
            Entrar na Sala
          </Button>
        </View>
        <View style={styles.createRoomContainer}>
          <Button
            disabled={loading}
            uppercase
            style={{
              alignSelf: 'center',
              marginVertical: theme.spacings.large,
            }}
            onPress={navigateToCreateRoom}>
            Criar nova sala
          </Button>
        </View>
      </ScrollView>
      <Snackbar
        visible={!!snackbarErrorMessage}
        duration={2000}
        style={{ marginBottom: theme.spacings.huge }}
        onDismiss={() => setSnackbarErrorMessage('')}>
        {snackbarErrorMessage}
      </Snackbar>
    </SafeAreaView>
  );
}

export default HomeScreen;
