import { MD3DarkTheme } from 'react-native-paper';
import { spacings } from '~/styles/spacings';

const colors: GlobalTheme.ThemeColors = {
  primary: '#3f51b5',
  primaryContainer: '#3e4f7e',
  secondary: '#3a454f',
  secondaryContainer: '#383b40',
  tertiary: '#795542',
  tertiaryContainer: '#5a4538',
  surface: '#202020',
  surfaceVariant: '#282828',
  surfaceDisabled: '#424242',
  background: '#121212',
  error: '#ef5350',
  errorContainer: '#4e342e',
  onPrimary: '#fff',
  onPrimaryContainer: '#003369',
  onSecondary: '#fff',
  onSecondaryContainer: '#f0f0f0',
  onTertiary: '#fff',
  onTertiaryContainer: '#2b1b11',
  onSurface: '#fff',
  onSurfaceVariant: '#dadada',
  onSurfaceDisabled: '#bfbfbf',
  onError: '#000',
  onErrorContainer: '#fff',
  onBackground: '#fff',
  outline: '#666666',
  outlineVariant: '#777777',
  inverseSurface: '#fff',
  inverseOnSurface: '#000',
  inversePrimary: '#003f51',
  shadow: '#000000',
  scrim: '#00000080',
  backdrop: '#00000099',
  elevation: {
    level0: '#212121',
    level1: '#272727',
    level2: 'rgba(0, 0, 0, 0.04)',
    level3: 'rgba(0, 0, 0, 0.08)',
    level4: 'rgba(0, 0, 0, 0.12)',
    level5: 'rgba(0, 0, 0, 0.16)',
  },
};

export const darkTheme: GlobalTheme.Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...colors,
  },
  spacings,
};
