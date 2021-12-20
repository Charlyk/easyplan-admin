import { configureStore } from '@reduxjs/toolkit';
import { createWrapper, HYDRATE } from 'next-redux-wrapper';
import createSagaMiddleware from 'redux-saga';
import rootSaga from 'redux/sagas';
import rootReducer from './redux/reducers/rootReducer';

const sagaMiddleware = createSagaMiddleware();

const hydratedReducer = (state, action) => {
  if (action.type === HYDRATE) {
    return {
      ...state,
      ...action.payload,
    };
  } else {
    return rootReducer(state, action);
  }
};

export const ReduxStore = configureStore({
  reducer: hydratedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([sagaMiddleware]),
});

// create a makeStore function
const makeStore = () => ReduxStore;

// export an assembled wrapper
export const wrapper = createWrapper(makeStore, { debug: false });

sagaMiddleware.run(rootSaga);

//obtaining the type of Dispatch function.
export type ReduxDispatch = typeof ReduxStore.dispatch;
