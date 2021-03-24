// enable redux devtool
import { applyMiddleware, compose, createStore } from "redux";
import thunk from "redux-thunk";
import timerMiddleware from "redux-timer-middleware";
import rootReducer from "./redux/reducers/rootReducer";
import { createWrapper } from 'next-redux-wrapper';

const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    })
    : compose;
const middlewares = [thunk, timerMiddleware];
const enhancer = composeEnhancers(applyMiddleware(...middlewares));
export const ReduxStore = createStore(rootReducer, enhancer);

// create a makeStore function
const makeStore = () => ReduxStore;

// export an assembled wrapper
export const wrapper = createWrapper(makeStore, {debug: false});
