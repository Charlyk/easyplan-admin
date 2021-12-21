import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { Context, createWrapper, HYDRATE } from 'next-redux-wrapper';
import createSagaMiddleware, { Task } from 'redux-saga';
import rootReducer from 'redux/reducers/rootReducer';
import rootSaga from 'redux/sagas';
import { ReduxState } from 'redux/types';

export const RESTATE = { type: '___RESET_REDUX_STATE___' };

export interface SagaStore<T extends ReduxState> extends EnhancedStore<T> {
  sagaTask?: Task;
}

const hydratedReducer = (state, action) => {
  if (action.type === HYDRATE) {
    return {
      ...state,
      ...action.payload,
    };
  } else if (action.type === RESTATE.type) {
    rootReducer(undefined, action);
  } else {
    return rootReducer(state, action);
  }
};

// create a variable to get access to the store outside components
export let ReduxStore: SagaStore<ReduxState>;

// create a makeStore function
export const makeStore = (_context: Context) => {
  const sagaMiddleware = createSagaMiddleware();

  const store: SagaStore<ReduxState> = configureStore({
    reducer: hydratedReducer,
    devTools: process.env.APP_ENV !== 'production',
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware().concat(sagaMiddleware);
    },
  });

  store.sagaTask = sagaMiddleware.run(rootSaga);
  ReduxStore = store;
  return store;
};

// export an assembled wrapper
export const wrapper = createWrapper<SagaStore<ReduxState>>(makeStore, {
  debug: false,
});