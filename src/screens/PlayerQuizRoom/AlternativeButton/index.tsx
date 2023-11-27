import React, { memo } from 'react';
import {
  ActivityIndicator,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import { RoomQuestionAlternativesKeys } from '~/types/entity';
import styles from './styles';

interface Props {
  alternative: RoomQuestionAlternativesKeys;
  selected: RoomQuestionAlternativesKeys | undefined;
  loading: boolean;
  backgroundColor: string;
  onPress: (alternative: RoomQuestionAlternativesKeys) => void;
}

function AlternativeButton({
  alternative,
  selected,
  loading,
  backgroundColor,
  onPress,
}: Props): JSX.Element {
  const theme = useTheme<GlobalTheme.Theme>();
  const isSelected = selected === alternative;
  const disabled = !!selected && !isSelected;

  return (
    <TouchableRipple
      disabled={disabled}
      style={[
        styles.button,
        {
          margin: theme.spacings.small,
          backgroundColor: disabled
            ? theme.colors.surfaceDisabled
            : backgroundColor,
          opacity: disabled ? 0.5 : 1,
        },
      ]}
      onPress={isSelected || disabled ? undefined : () => onPress(alternative)}>
      {isSelected && loading ? (
        <ActivityIndicator />
      ) : (
        <Text variant="displaySmall">{alternative.toUpperCase()}</Text>
      )}
    </TouchableRipple>
  );
}

export default memo(AlternativeButton);
