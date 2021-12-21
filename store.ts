import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { Context, createWrapper } from 'next-redux-wrapper';
import createSagaMiddleware, { Task } from 'redux-saga';
import rootReducer from 'redux/reducers/rootReducer';
import rootSaga from 'redux/sagas';
import { ReduxState } from 'redux/types';

export const RESTATE = { type: '___RESET_REDUX_STATE___' };

export interface SagaStore<T extends ReduxState> extends EnhancedStore<T> {
  sagaTask?: Task;
}

// create a variable to get access to the store outside components
export let ReduxStore: SagaStore<ReduxState>;

// create a makeStore function
export const makeStore = (_context: Context): SagaStore<ReduxState> => {
  const sagaMiddleware = createSagaMiddleware();

  const store = configureStore({
    reducer: rootReducer,
    devTools: process.env.APP_ENV !== 'production',
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware().concat(sagaMiddleware);
    },
  });

  (store as unknown as SagaStore<ReduxState>).sagaTask =
    sagaMiddleware.run(rootSaga);
  ReduxStore = store as unknown as SagaStore<ReduxState>;
  return store as unknown as SagaStore<ReduxState>;
};

// export an assembled wrapper
export const wrapper = createWrapper<SagaStore<ReduxState>>(makeStore, {
  debug: false,
});
