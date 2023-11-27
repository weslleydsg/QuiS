import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

type Collection =
  FirebaseFirestoreTypes.CollectionReference<FirebaseFirestoreTypes.DocumentData>;

type OrderBy =
  FirebaseFirestoreTypes.Query<FirebaseFirestoreTypes.DocumentData>;

type OrderByOptionsTypes = 'asc' | 'desc';

type OrderByOption<FieldsData> =
  | {
      [key in keyof FieldsData]: OrderByOptionsTypes;
    }
  | undefined;

interface CollectionManipulationOptions<FieldsData> {
  orderBy?: Partial<OrderByOption<FieldsData>>;
}

export interface CollectionRealTimeOptions<FieldsData = undefined> {
  ignoreCache?: boolean;
  refetchWhenCache?: boolean;
  manipulation?: CollectionManipulationOptions<FieldsData>;
}

export const getCollectionOrderedBy = <FieldsData>(
  collection: Collection | OrderBy,
  orderBy: OrderByOption<FieldsData>,
): Collection | OrderBy => {
  const orderByEntries = Object.entries<OrderByOptionsTypes>(orderBy || {});
  const playersCollectionsQuery = orderByEntries.reduce(
    (query, [key, value]) => query.orderBy(key, value),
    collection,
  );
  return playersCollectionsQuery;
};
