import firestore from '@react-native-firebase/firestore';
import { useEffect, useState } from 'react';
import { CollectionHookReturnType } from '~/types/collection';
import {
  CreateRoomDTO,
  CreateRoomQuestionDTO,
  RoomDTO,
  RoomPlayerDTO,
  RoomQuestionDTO,
} from '~/types/dto';
import {
  Room,
  RoomCollectionsLazyLoad,
  RoomLazyLoad,
  RoomPlayer,
  RoomPlayerQuizStatus,
  RoomQuestion,
  RoomStatus,
} from '~/types/entity';
import {
  CollectionRealTimeOptions,
  getCollectionOrderedBy,
} from '~/utils/collectionsUtils';
import { createShortHash } from '~/utils/cryptoUtils';

const roomsCollection = firestore().collection('Rooms');
const playersCollectionPath = 'players';
const questionsCollectionPath = 'questions';

export const updateRoomPlayer = async (
  roomCode: Room['code'],
  username: RoomPlayer['username'],
  player: Partial<RoomPlayerDTO>,
): Promise<void> => {
  await roomsCollection
    .doc(roomCode)
    .collection(playersCollectionPath)
    .doc(username)
    .update({
      ...player,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
};

const addPlayerToRoom = async (
  roomCode: Room['code'],
  username: RoomPlayer['username'],
): Promise<void> => {
  const timestamp = firestore.FieldValue.serverTimestamp();
  const player: RoomPlayerDTO = {
    createdAt: timestamp,
    updatedAt: timestamp,
    quizStatus: RoomPlayerQuizStatus.active,
  };
  await roomsCollection
    .doc(roomCode)
    .collection(playersCollectionPath)
    .doc(username)
    .set(player);
};

export const AddPlayerToRoom = (): CollectionHookReturnType<
  typeof addPlayerToRoom
> => {
  const [loading, setLoading] = useState(false);

  const transactionFn: typeof addPlayerToRoom = async (...params) => {
    setLoading(true);
    await addPlayerToRoom(...params);
    setLoading(false);
  };

  return { loading, transactionFn };
};

export const updateRoomPlayerQuizStatus = async (
  roomCode: Room['code'],
  username: RoomPlayer['username'],
  quizStatus: RoomPlayerDTO['quizStatus'],
): Promise<void> => {
  await updateRoomPlayer(roomCode, username, { quizStatus });
};

const getRoomPlayer = async (
  roomCode: Room['code'],
  playerUsername: RoomPlayer['username'],
): Promise<RoomPlayer | undefined> => {
  const playerData = await roomsCollection
    .doc(roomCode)
    .collection(playersCollectionPath)
    .doc(playerUsername)
    .get();
  const playerFields = playerData.data() as RoomPlayerDTO | undefined;
  if (!playerFields) {
    return undefined;
  }
  return {
    ...playerFields,
    username: playerUsername,
  };
};

export const GetRoomPlayerOnce = (): CollectionHookReturnType<
  typeof getRoomPlayer
> => {
  const [loading, setLoading] = useState(false);

  const transactionFn: typeof getRoomPlayer = async (...params) => {
    setLoading(true);
    const room = await getRoomPlayer(...params);
    setLoading(false);
    return room;
  };

  return { loading, transactionFn };
};

const getRoomPlayers = async (
  roomCode: Room['code'],
): Promise<RoomPlayer[]> => {
  const playersData = await roomsCollection
    .doc(roomCode)
    .collection(playersCollectionPath)
    .get();
  const players = playersData.docs.map((doc) => {
    const playerFields = doc.data() as RoomPlayerDTO;
    return {
      ...playerFields,
      username: doc.id,
    };
  });
  return players;
};

export const GetRoomPlayers = (
  roomCode: Room['code'],
  options?: CollectionRealTimeOptions<RoomPlayerDTO>,
): RoomPlayer[] => {
  const [players, setPlayers] = useState<RoomPlayer[]>([]);

  useEffect(() => {
    const playersCollection = roomsCollection
      .doc(roomCode)
      .collection(playersCollectionPath);
    const playersCollectionQuery = getCollectionOrderedBy(
      playersCollection,
      options?.manipulation?.orderBy,
    );
    const unsubscribe = playersCollectionQuery.onSnapshot(
      { includeMetadataChanges: !!options?.refetchWhenCache },
      (snapshot) => {
        if (options?.ignoreCache && snapshot.metadata.fromCache) {
          return;
        }
        if (!snapshot) {
          return;
        }
        const newPlayers = snapshot.docs.map((doc) => {
          const playerData = doc.data() as RoomPlayerDTO;
          const player: RoomPlayer = {
            ...playerData,
            username: doc.id,
          };
          return player;
        });
        setPlayers(newPlayers);
      },
    );

    return unsubscribe;
  }, [
    options?.ignoreCache,
    options?.manipulation?.orderBy,
    options?.refetchWhenCache,
    roomCode,
  ]);

  return players;
};

const getRoomQuestions = async (
  roomCode: Room['code'],
): Promise<RoomQuestion[]> => {
  const data = await roomsCollection
    .doc(roomCode)
    .collection(questionsCollectionPath)
    .get();
  const questions = data.docs.map((doc) => {
    const question = doc.data() as RoomQuestion;
    return question;
  });
  return questions;
};

export const GetRoomQuestions = (
  roomCode: Room['code'],
  options?: CollectionRealTimeOptions<RoomQuestionDTO>,
): RoomQuestion[] => {
  const [questions, setQuestions] = useState<RoomQuestion[]>([]);

  useEffect(() => {
    const collection = roomsCollection
      .doc(roomCode)
      .collection(questionsCollectionPath);
    const collectionQuery = getCollectionOrderedBy(
      collection,
      options?.manipulation?.orderBy,
    );
    const unsubscribe = collectionQuery.onSnapshot(
      { includeMetadataChanges: !!options?.refetchWhenCache },
      (snapshot) => {
        if (options?.ignoreCache && snapshot.metadata.fromCache) {
          return;
        }
        if (!snapshot) {
          return;
        }
        const newQuestions = snapshot.docs.map((doc) => {
          const question = doc.data() as RoomQuestion;
          return question;
        });
        setQuestions(newQuestions);
      },
    );

    return unsubscribe;
  }, [
    options?.ignoreCache,
    options?.manipulation?.orderBy,
    options?.refetchWhenCache,
    roomCode,
  ]);

  return questions;
};

const addQuestionsToRoom = async (
  roomCode: Room['code'],
  questions: CreateRoomQuestionDTO[],
): Promise<void> => {
  const promises = questions.map(async (question, index) => {
    const questionFields: RoomQuestionDTO = {
      ...question,
      playersAnswer: {},
    };
    await roomsCollection
      .doc(roomCode)
      .collection(questionsCollectionPath)
      .doc(index.toString())
      .set(questionFields);
  });
  await Promise.all(promises);
};

export const AddQuestionsToRoom = (): CollectionHookReturnType<
  typeof addQuestionsToRoom
> => {
  const [loading, setLoading] = useState(false);

  const transactionFn: typeof addQuestionsToRoom = async (...params) => {
    setLoading(true);
    const room = await addQuestionsToRoom(...params);
    setLoading(false);
    return room;
  };

  return { loading, transactionFn };
};

const updateQuestion = async (
  roomCode: Room['code'],
  questionNumber: number,
  question: Partial<RoomQuestionDTO>,
): Promise<void> => {
  console.log('question :>> ', question);
  await roomsCollection
    .doc(roomCode)
    .collection(questionsCollectionPath)
    .doc(questionNumber.toString())
    .update(question);
};

const updatePlayersAnswer = async (
  roomCode: Room['code'],
  questionIndex: number,
  playersAnswer: RoomQuestion['playersAnswer'],
): Promise<void> => {
  await updateQuestion(roomCode, questionIndex, {
    playersAnswer,
  });
};

export const UpdatePlayersAnswer = (): CollectionHookReturnType<
  typeof updatePlayersAnswer
> => {
  const [loading, setLoading] = useState(false);

  const transactionFn: typeof updatePlayersAnswer = async (...params) => {
    setLoading(true);
    const room = await updatePlayersAnswer(...params);
    setLoading(false);
    return room;
  };

  return { loading, transactionFn };
};

const getRoomByCode = async (
  code: Room['code'],
): Promise<RoomLazyLoad | undefined> => {
  const roomDoc = await roomsCollection.doc(code).get();
  if (!roomDoc.exists) {
    return undefined;
  }
  const roomFields = roomDoc.data() as RoomDTO;
  const roomsCollectionLazyLoad: RoomCollectionsLazyLoad = {
    get questions() {
      return getRoomQuestions(code);
    },
    get players() {
      return getRoomPlayers(code);
    },
  };
  const room: RoomLazyLoad = {
    ...roomFields,
    ...roomsCollectionLazyLoad,
    code: roomDoc.id,
  };
  return room;
};

export const GetRoomOnce = (): CollectionHookReturnType<
  typeof getRoomByCode
> => {
  const [loading, setLoading] = useState(false);

  const transactionFn: typeof getRoomByCode = async (...params) => {
    setLoading(true);
    const room = await getRoomByCode(...params);
    setLoading(false);
    return room;
  };

  return { loading, transactionFn };
};

export const GetRoom = (
  code: Room['code'],
  options?: CollectionRealTimeOptions,
): Room | undefined => {
  const [room, setRoom] = useState<Room | undefined>();

  useEffect(() => {
    const unsubscribe = roomsCollection
      .doc(code)
      .onSnapshot(
        { includeMetadataChanges: !!options?.refetchWhenCache },
        (snapshot) => {
          if (options?.ignoreCache && snapshot.metadata.fromCache) {
            return;
          }
          const roomData = snapshot.data() as Room | undefined;
          setRoom(roomData);
        },
      );

    return unsubscribe;
  }, [code, options?.ignoreCache, options?.refetchWhenCache]);

  return room;
};

const createRoom = async (roomFields: CreateRoomDTO): Promise<Room['code']> => {
  const fields: RoomDTO = {
    ...roomFields,
    status: RoomStatus.waiting,
    currentQuestion: 0,
  };
  const roomCode = createShortHash();
  const roomFound = await getRoomByCode(roomCode);
  if (roomFound) {
    return createRoom(roomFields);
  }
  await roomsCollection.doc(roomCode).set(fields);
  return roomCode;
};

export const CreateRoom = (): CollectionHookReturnType<typeof createRoom> => {
  const [loading, setLoading] = useState(false);

  const transactionFn: typeof createRoom = async (...params) => {
    setLoading(true);
    const roomCode = await createRoom(...params);
    setLoading(false);
    return roomCode;
  };

  return { loading, transactionFn };
};

const updateRoom = async (
  code: Room['code'],
  room: Partial<RoomDTO>,
): Promise<void> => {
  await roomsCollection.doc(code).update(room);
};

const updateRoomStatus = async (
  code: Room['code'],
  status: RoomDTO['status'],
): Promise<void> => {
  await updateRoom(code, { status });
};

export const UpdateRoomStatus = (): CollectionHookReturnType<
  typeof updateRoomStatus
> => {
  const [loading, setLoading] = useState(false);

  const transactionFn: typeof updateRoomStatus = async (...params) => {
    setLoading(true);
    const roomCode = await updateRoomStatus(...params);
    setLoading(false);
    return roomCode;
  };

  return { loading, transactionFn };
};

const updateRoomCurrentQuestion = async (
  code: Room['code'],
  currentQuestion: RoomDTO['currentQuestion'],
): Promise<void> => {
  await updateRoom(code, { currentQuestion });
};

export const UpdateRoomCurrentQuestion = (): CollectionHookReturnType<
  typeof updateRoomCurrentQuestion
> => {
  const [loading, setLoading] = useState(false);

  const transactionFn: typeof updateRoomCurrentQuestion = async (...params) => {
    setLoading(true);
    const roomCode = await updateRoomCurrentQuestion(...params);
    setLoading(false);
    return roomCode;
  };

  return { loading, transactionFn };
};
