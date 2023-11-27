export type MainStack = {
  Home: undefined;
  CreateRoom: undefined;
  OwnerRoom: {
    code: string;
  };
  PlayerWaitingRoom: {
    code: string;
    username: string;
  };
  PlayerQuizRoom: {
    code: string;
    username: string;
  };
};
