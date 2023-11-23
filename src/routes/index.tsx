import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MainRoutes from './main.routes';

const styles = StyleSheet.create({
  safeAreaProvider: {
    position: 'relative',
  },
});

function Routes(): JSX.Element {
  return (
    <SafeAreaProvider style={styles.safeAreaProvider}>
      <MainRoutes />
    </SafeAreaProvider>
  );
}

export default Routes;
