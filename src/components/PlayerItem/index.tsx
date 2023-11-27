import React, { memo } from 'react';
import { Card, Text, useTheme } from 'react-native-paper';
import { RoomPlayer, RoomPlayerQuizStatus } from '~/types/entity';

interface Props {
  username: string;
  self: boolean;
  quizStatus: RoomPlayer['quizStatus'];
  progress?: number;
}

function PlayerItem({
  username,
  self,
  quizStatus,
  progress,
}: Props): JSX.Element {
  const theme = useTheme<GlobalTheme.Theme>();
  let backgroundColor: string | undefined;
  if (self) {
    backgroundColor = theme.colors.primaryContainer;
  } else if (quizStatus === RoomPlayerQuizStatus.earlyQuit) {
    backgroundColor = theme.colors.error;
  }

  return (
    <Card
      style={{
        marginVertical: theme.spacings.small,
        backgroundColor,
      }}>
      <Card.Content
        style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text>{username}</Text>
        {progress !== undefined && <Text>{`${progress}%`}</Text>}
      </Card.Content>
    </Card>
  );
}

export default memo(PlayerItem);
