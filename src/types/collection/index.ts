export interface CollectionHookReturnType<TransactionFn> {
  loading: boolean;
  transactionFn: TransactionFn;
}
