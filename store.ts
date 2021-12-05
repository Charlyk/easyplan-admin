import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import createSagaMiddleware from 'redux-saga';
import timerMiddleware from 'redux-timer-middleware';
import rootReducer from 'redux/reducers/rootReducer';
import rootSaga from 'redux/sagas';

const sagaMiddleware = createSagaMiddleware();

export const ReduxStore = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([sagaMiddleware, timerMiddleware]),
});

// create a makeStore function
const makeStore = () => ReduxStore;

// export an assembled wrapper
export const wrapper = createWrapper(makeStore, { debug: false });

sagaMiddleware.run(rootSaga);

//obtaining the type of Dispatch function.
export type ReduxDispatch = typeof ReduxStore.dispatch;
