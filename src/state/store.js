import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import reducers from './reducers';

const store = createStore(reducers, applyMiddleware(thunk));

const withStore = (Component) => (props) => (
  <Provider store={store}>
    <Component {...props} /> 
  </Provider>
)
  

export { withStore };
export default store;