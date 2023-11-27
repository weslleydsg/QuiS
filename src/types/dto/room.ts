import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import {
  RoomPlayerQuizStatus,
  RoomQuestion,
  RoomStatus,
  RoomSubjects,
} from '../entity';

export interface RoomQuestionDTO extends RoomQuestion {}

export interface CreateRoomQuestionDTO
  extends Omit<RoomQuestionDTO, 'playersAnswer'> {}

export interface RoomPlayerDTO {
  quizStatus: keyof typeof RoomPlayerQuizStatus;
  createdAt: FirebaseFirestoreTypes.FieldValue;
  updatedAt: FirebaseFirestoreTypes.FieldValue;
}

export type RoomSubjectsDTO = RoomSubjects;

export interface RoomDTO {
  ownerUsername: string;
  status: keyof typeof RoomStatus;
  subjects: RoomSubjectsDTO;
  currentQuestion: number;
}

export interface CreateRoomDTO
  extends Omit<RoomDTO, 'status' | 'currentQuestion'> {}
