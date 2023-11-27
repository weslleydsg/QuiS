import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  Theme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useTheme } from 'react-native-paper';
import CreateRoom from '~/screens/CreateRoom';
import Home from '~/screens/Home';
import OwnerRoom from '~/screens/OwnerRoom';
import PlayerQuizRoom from '~/screens/PlayerQuizRoom';
import PlayerWaitingRoom from '~/screens/PlayerWaitingRoom';
import { MainStack } from '~/types';

const Stack = createNativeStackNavigator<MainStack>();

function StackScreen(): JSX.Element {
  const theme = useTheme();
  const navigationTheme = theme.dark ? DarkTheme : DefaultTheme;
  const combinedTheme: Theme = {
    ...navigationTheme,
    ...theme,
    colors: {
      ...navigationTheme.colors,
      ...theme.colors,
    },
  };
  return (
    <NavigationContainer theme={combinedTheme}>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ title: 'QuiS' }}
        />
        <Stack.Screen
          name="CreateRoom"
          component={CreateRoom}
          options={{ title: 'Crie uma Sala' }}
        />
        <Stack.Screen name="OwnerRoom" component={OwnerRoom} />
        <Stack.Screen name="PlayerWaitingRoom" component={PlayerWaitingRoom} />
        <Stack.Screen name="PlayerQuizRoom" component={PlayerQuizRoom} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default StackScreen;
