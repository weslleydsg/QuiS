import type React from 'react';
import PaperProvider from './PaperProvider';

interface Props {
  children: React.ReactNode;
}

function AppProvider({ children }: Props): JSX.Element {
  return <PaperProvider>{children}</PaperProvider>;
}

export default AppProvider;
