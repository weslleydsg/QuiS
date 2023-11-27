import React, { memo } from 'react';
import { Chip, useTheme } from 'react-native-paper';

interface Props {
  children: string;
  selected: boolean;
  disabled: boolean;
  onPress(subject: string): void;
}

function Subject({
  children,
  selected,
  disabled,
  onPress,
}: Props): JSX.Element {
  const theme = useTheme<GlobalTheme.Theme>();

  return (
    <Chip
      compact
      showSelectedCheck={false}
      selected={selected}
      selectedColor={theme.colors.inverseSurface}
      disabled={disabled}
      style={selected ? { backgroundColor: theme.colors.tertiary } : undefined}
      onPress={() => onPress(children)}>
      {children}
    </Chip>
  );
}

export default memo(Subject);
