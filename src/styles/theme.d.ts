import { MD3Theme } from 'react-native-paper';

export declare global {
  namespace GlobalTheme {
    type ThemeColors = MD3Theme['colors'];

    interface ThemeSpacings {
      large: number;
    }

    interface Theme extends MD3Theme {
      colors: ThemeColors;
      spacings: ThemeSpacings;
    }
  }
}
