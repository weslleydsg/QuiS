import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import useIsDarkMode from '~/hooks/useIsDarkMode';
import { darkTheme, defaultTheme } from '~/styles';

interface Props {
  children: React.ReactNode;
}

function Provider({ children }: Props): JSX.Element {
  const isDarkMode = useIsDarkMode();
  return (
    <PaperProvider theme={isDarkMode ? darkTheme : defaultTheme}>
      {children}
    </PaperProvider>
  );
}

export default Provider;
