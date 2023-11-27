import React, { memo, useCallback } from 'react';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';
import Subject from '../Subject';
import styles from './styles';

export type SelectedSubjects = [string, string] | [string] | [];

interface Props {
  onChange(selectedSubjects: SelectedSubjects): void;
}

const subjects = ['Ciências', 'Artes', 'História', 'Matemática', 'Tecnologia'];

function Subjects({ onChange }: Props): JSX.Element {
  const theme = useTheme<GlobalTheme.Theme>();
  const [selected, setSelected] = React.useState({
    [subjects[0]]: false,
    [subjects[1]]: false,
    [subjects[2]]: false,
    [subjects[3]]: false,
    [subjects[4]]: false,
  });
  const disabledRest =
    Object.values(selected).filter((value) => value).length >= 2;
  const containerSpacings = { marginBottom: theme.spacings.large };

  const onPress = useCallback(
    (subject: string) => {
      setSelected((previousValue) => {
        const pressedCurrentValue = previousValue[subject];
        const newValue = {
          ...previousValue,
          [subject]: !pressedCurrentValue,
        };
        const selectedSubjects = Object.keys(newValue).filter(
          (key) => newValue[key],
        ) as SelectedSubjects;
        onChange(selectedSubjects);
        return newValue;
      });
    },
    [onChange],
  );

  return (
    <View>
      <View style={[styles.container, containerSpacings]}>
        <Subject
          selected={selected[subjects[0]]}
          disabled={disabledRest && !selected[subjects[0]]}
          onPress={onPress}>
          {subjects[0]}
        </Subject>
        <Subject
          selected={selected[subjects[1]]}
          disabled={disabledRest && !selected[subjects[1]]}
          onPress={onPress}>
          {subjects[1]}
        </Subject>
        <Subject
          selected={selected[subjects[2]]}
          disabled={disabledRest && !selected[subjects[2]]}
          onPress={onPress}>
          {subjects[2]}
        </Subject>
      </View>
      <View style={[styles.container, containerSpacings]}>
        <Subject
          selected={selected[subjects[3]]}
          disabled={disabledRest && !selected[subjects[3]]}
          onPress={onPress}>
          {subjects[3]}
        </Subject>
        <Subject
          selected={selected[subjects[4]]}
          disabled={disabledRest && !selected[subjects[4]]}
          onPress={onPress}>
          {subjects[4]}
        </Subject>
      </View>
    </View>
  );
}

export default memo(Subjects);
