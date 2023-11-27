import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { ScrollView } from 'react-native';
import {
  Button,
  Headline,
  HelperText,
  Snackbar,
  TextInput,
  useTheme,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CreateRoom } from '~/collections/rooms';
import { MainStack } from '~/types';
import Subjects, { SelectedSubjects } from './components/Subjects';
import styles from './styles';

const EMPTY_FIELD_ERROR = 'O campo não pode ser vazio.';

function CreateRoomScreen(): JSX.Element {
  const navigation = useNavigation<NavigationProp<MainStack, 'CreateRoom'>>();
  const theme = useTheme<GlobalTheme.Theme>();
  const { loading, transactionFn: createRoom } = CreateRoom();
  const [username, setUsername] = React.useState('');
  const [usernameErrorMessage, setUsernameErrorMessage] = React.useState('');
  const [selectedSubjects, setSelectedSubjects] =
    React.useState<SelectedSubjects>([]);
  const [subjectsError, setSubjectsError] = React.useState(false);

  const onChangeSubjects = useCallback((subjects: SelectedSubjects) => {
    setSelectedSubjects(subjects);
  }, []);

  const navigateToOwnerRoom = (roomCode: string) => {
    navigation.navigate('OwnerRoom', { code: roomCode });
  };

  const submit = async () => {
    setUsernameErrorMessage(username ? '' : EMPTY_FIELD_ERROR);
    if (!username) {
      return;
    }
    if (selectedSubjects.length !== 2) {
      setSubjectsError(true);
      return;
    }
    const roomCode = await createRoom({
      ownerUsername: username,
      subjects: selectedSubjects,
    });
    navigateToOwnerRoom(roomCode);
  };

  return (
    <SafeAreaView
      style={[styles.screen, { margin: theme.spacings.large }]}
      edges={['right', 'bottom', 'left']}>
      <ScrollView keyboardShouldPersistTaps="never">
        <Headline
          style={[
            styles.headline,
            {
              marginTop: theme.spacings.large,
              marginBottom: theme.spacings.big,
              color: theme.colors.primary,
            },
          ]}>
          Crie uma nova sala
        </Headline>
        <TextInput
          mode="outlined"
          label="Nome de usuário"
          placeholder="Digite o seu nome de usuário"
          value={username}
          error={!!usernameErrorMessage}
          onChangeText={(text) => {
            setUsername(text.trim());
          }}
        />
        <HelperText type="error" visible={!!usernameErrorMessage}>
          {usernameErrorMessage}
        </HelperText>
        <Subjects onChange={onChangeSubjects} />
      </ScrollView>
      <Snackbar
        visible={subjectsError}
        duration={2000}
        style={{ marginBottom: theme.spacings.huge }}
        onDismiss={() => setSubjectsError(false)}>
        Por favor selecione duas disciplinas.
      </Snackbar>
      <Button
        mode="contained"
        loading={loading}
        disabled={loading}
        uppercase
        style={[
          styles.createRoomContainer,
          {
            marginTop: theme.spacings.big,
          },
        ]}
        onPress={submit}>
        Criar Sala
      </Button>
    </SafeAreaView>
  );
}

export default CreateRoomScreen;
