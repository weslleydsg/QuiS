import { DefaultTheme } from 'react-native-paper';
import { spacings } from '~/styles/spacings';

const colors: GlobalTheme.ThemeColors = {
  primary: '#007bff',
  primaryContainer: '#e0f7ff',
  secondary: '#6c757d',
  secondaryContainer: '#f0f4f7',
  tertiary: '#673ab7',
  tertiaryContainer: '#f4e2ff',
  surface: '#fff',
  surfaceVariant: '#fafafa',
  surfaceDisabled: '#cccccc',
  background: '#fff',
  error: '#f44336',
  errorContainer: '#ffebee',
  onPrimary: '#fff',
  onPrimaryContainer: '#002037',
  onSecondary: '#fff',
  onSecondaryContainer: '#26292f',
  onTertiary: '#fff',
  onTertiaryContainer: '#1e1b26',
  onSurface: '#000',
  onSurfaceVariant: '#212121',
  onSurfaceDisabled: '#828282',
  onError: '#fff',
  onErrorContainer: '#414342',
  onBackground: '#000',
  outline: '#9e9e9e',
  outlineVariant: '#8a8a8a',
  inverseSurface: '#f0f0f0',
  inverseOnSurface: '#000',
  inversePrimary: '#0069d9',
  shadow: '#000000',
  scrim: '#00000080',
  backdrop: '#00000099',
  elevation: {
    level0: '#fff',
    level1: '#f5f5f5',
    level2: 'rgba(0, 0, 0, 0.08)',
    level3: 'rgba(0, 0, 0, 0.12)',
    level4: 'rgba(0, 0, 0, 0.16)',
    level5: 'rgba(0, 0, 0, 0.20)',
  },
};

export const defaultTheme: GlobalTheme.Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    ...colors,
  },
  spacings,
};
