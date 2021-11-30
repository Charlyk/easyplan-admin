// enable redux devtool
import { createWrapper } from 'next-redux-wrapper';
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import timerMiddleware from 'redux-timer-middleware';
import rootReducer from 'redux/reducers/rootReducer';

const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;
const middlewares = [thunk, timerMiddleware];
const enhancer = composeEnhancers(applyMiddleware(...middlewares));
export const ReduxStore = createStore(rootReducer, enhancer);

// create a makeStore function
const makeStore = () => ReduxStore;

// export an assembled wrapper
export const wrapper = createWrapper(makeStore, { debug: false });
