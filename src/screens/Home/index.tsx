import React from 'react';
import { ScrollView, View } from 'react-native';
import { Button, Headline, TextInput, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './styles';

function HomeScreen(): JSX.Element {
  const theme = useTheme<GlobalTheme.Theme>();
  const [roomCode, setRoomCode] = React.useState('');
  const [roomInputError] = React.useState('');

  const submit = () => {
    // TODO: navigate to room screen
  };

  const navigateToCreateRoom = () => {
    // TODO: navigate to create room screen
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
              color: theme.colors.primary,
            },
          ]}>
          Bem-vindo!
        </Headline>
        <View style={styles.searchRoomContainer}>
          <TextInput
            label="Código da Sala"
            placeholder="Digite o código da sala"
            value={roomCode}
            error={!!roomInputError}
            onChangeText={setRoomCode}
            onSubmitEditing={submit}
          />
          <Button
            mode="contained"
            uppercase
            style={[
              styles.searchRoomButton,
              {
                marginTop: theme.spacings.big,
              },
            ]}
            onPress={submit}>
            Entrar na Sala
          </Button>
        </View>
        <View style={styles.createRoomContainer}>
          <Button
            mode="text"
            uppercase
            style={{
              alignSelf: 'center',
              marginVertical: theme.spacings.big,
            }}
            onPress={navigateToCreateRoom}>
            Criar nova sala
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default HomeScreen;
