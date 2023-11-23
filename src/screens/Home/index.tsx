import React from 'react';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './styles';

function HomeScreen(): JSX.Element {
  return (
    <SafeAreaView style={styles.screen} edges={['right', 'bottom', 'left']}>
      <Text>Olá</Text>
    </SafeAreaView>
  );
}

export default HomeScreen;
