import { createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "reducers";
import setAuthToken from "helpers/setAuthToken";
import { HotModule } from "interfaces";

export default function configureStore(preloadedState: {}) {
  // const middlewares = [];
  // const middlewareEnhancer = applyMiddleware(...middlewares);

  // const enhancers = [middlewareEnhancer];
  const composedEnhancers = composeWithDevTools();

  const store = createStore(rootReducer, preloadedState, composedEnhancers);

  if (process.env.NODE_ENV !== "production" && (module as HotModule).hot) {
    (module as HotModule).hot.accept("./reducers", () => store.replaceReducer(rootReducer));
  }

  let currentState = store.getState();

  store.subscribe(() => {
    let previousState = currentState;
    currentState = store.getState();

    // if the token changes set the value in localStorage and axios headers
    if ((previousState as any).user.token !== (currentState as any).user.token) {
      const token = (currentState as any).user.token;
      setAuthToken({ token });
    }
  });


  return store;
}
