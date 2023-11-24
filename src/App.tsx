import React from 'react';
import { Platform, StatusBar } from 'react-native';
import useIsDarkMode from '~/hooks/useIsDarkMode';
import AppProvider from '~/providers/AppProvider';
import Routes from '~/routes';

function App(): JSX.Element {
  const isDarkMode = useIsDarkMode();
  StatusBar.setBarStyle(isDarkMode ? 'light-content' : 'dark-content');
  if (Platform.OS === 'android' && Platform.Version >= 23) {
    StatusBar.setBackgroundColor(isDarkMode ? 'gray' : 'white');
  }
  return (
    <AppProvider>
      <Routes />
    </AppProvider>
  );
}

export default App;
