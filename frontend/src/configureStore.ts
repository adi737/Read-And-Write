import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";
import rootReducer from "reducers";
import setAuthToken from "helpers/setAuthToken";
import { HotModule, State } from "interfaces";

export default function configureStore(preloadedState: {}) {
  const middlewares = [thunkMiddleware];
  const middlewareEnhancer = applyMiddleware(...middlewares);

  const enhancers = [middlewareEnhancer];
  const composedEnhancers = composeWithDevTools(...enhancers);

  const store = createStore(rootReducer, preloadedState, composedEnhancers);

  if (process.env.NODE_ENV !== "production" && (module as HotModule).hot) {
    (module as HotModule).hot.accept("./reducers", () => store.replaceReducer(rootReducer));
  }

  let currentState = store.getState();

  store.subscribe(() => {
    let previousState = currentState;
    currentState = store.getState();

    // if the token changes set the value in localStorage and axios headers
    if ((previousState as State).user.token !== (currentState as State).user.token) {
      const token = (currentState as State).user.token;
      const userID = (currentState as State).user.userID;
      setAuthToken({ token, userID });
    }
  });


  return store;
}
