import { useColorScheme } from 'react-native';

const useIsDarkMode = (): boolean => useColorScheme() === 'dark';

export default useIsDarkMode;
