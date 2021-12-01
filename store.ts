// enable redux devtool
import { createWrapper } from 'next-redux-wrapper';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
// import createSagaMiddleware from 'redux-saga';
import timerMiddleware from 'redux-timer-middleware';
import rootReducer from 'redux/reducers/rootReducer';

const middlewares = [timerMiddleware];
export const ReduxStore = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(...middlewares)),
);

// create a makeStore function
const makeStore = () => ReduxStore;

// export an assembled wrapper
export const wrapper = createWrapper(makeStore, { debug: false });

// obtaining the type of the state.
export type ReduxStateType = ReturnType<typeof ReduxStore.getState>;

//obtaining the type of Dispatch function.
export type ReduxDispatch = typeof ReduxStore.dispatch;
