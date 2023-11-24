import React from 'react';
import { Button, Headline, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import environment from '~/config/environment';
import styles from './styles';

function HomeScreen(): JSX.Element {
  const theme = useTheme<GlobalTheme.Theme>();
  console.log('environment.TEST :>> ', environment.TEST);
  return (
    <SafeAreaView
      style={[styles.screen, { margin: theme.spacings.large }]}
      edges={['right', 'bottom', 'left']}>
      <Headline style={{ color: theme.colors.primary }}>primary</Headline>
      <Headline style={{ color: theme.colors.secondary }}>secondary</Headline>
      <Headline style={{ color: theme.colors.tertiary }}>tertiary</Headline>
      <Headline style={{ color: theme.colors.error }}>error</Headline>
      <Headline style={{ color: theme.colors.onErrorContainer }}>
        onErrorContainer
      </Headline>
      <Headline style={{ color: theme.colors.primaryContainer }}>
        primaryContainer
      </Headline>
      <Headline style={{ color: theme.colors.secondaryContainer }}>
        secondaryContainer
      </Headline>
      <Headline style={{ color: theme.colors.surface }}>surface</Headline>
      <Headline style={{ color: theme.colors.elevation.level0 }}>
        elevation.level0
      </Headline>
      <Headline style={{ color: theme.colors.elevation.level1 }}>
        elevation.level1
      </Headline>
      <Headline style={{ color: theme.colors.elevation.level2 }}>
        elevation.level2
      </Headline>
      <Headline style={{ color: theme.colors.elevation.level3 }}>
        elevation.level3
      </Headline>
      <Button onPress={() => {}} mode="outlined">
        Press Me
      </Button>
    </SafeAreaView>
  );
}

export default HomeScreen;
