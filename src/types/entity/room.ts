import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export enum RoomQuestionAlternativesKeys {
  a = 'a',
  b = 'b',
  c = 'c',
  d = 'd',
}

export interface RoomQuestion {
  description: string;
  correctAlternative: keyof typeof RoomQuestionAlternativesKeys;
  alternatives: {
    [key in RoomQuestionAlternativesKeys]: string;
  };
  playersAnswer: {
    [username: RoomPlayer['username']]: RoomQuestionAlternativesKeys;
  };
}

export enum RoomPlayerQuizStatus {
  active = 'active',
  earlyQuit = 'earlyQuit',
}

export interface RoomPlayer {
  username: string;
  quizStatus: keyof typeof RoomPlayerQuizStatus;
  createdAt: FirebaseFirestoreTypes.FieldValue;
  updatedAt: FirebaseFirestoreTypes.FieldValue;
}

export enum RoomStatus {
  waiting = 'waiting',
  playing = 'playing',
  abandoned = 'abandoned',
  finished = 'finished',
}

interface RoomPosLoad {
  code: string;
}

export type RoomSubjects = [string, string];

export interface RoomFields {
  ownerUsername: string;
  status: keyof typeof RoomStatus;
  subjects: RoomSubjects;
  currentQuestion: number;
}

export interface Room extends RoomPosLoad, RoomFields {}

export interface RoomCollectionsLazyLoad {
  questions: Promise<RoomQuestion[]>;
  players: Promise<RoomPlayer[]>;
}

export interface RoomLazyLoad
  extends RoomPosLoad,
    RoomFields,
    RoomCollectionsLazyLoad {}
