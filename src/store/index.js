import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import auth from './auth';
import onlineUsers from './onlineUsers';
import messages from './messages';

const reducer = combineReducers({
  auth,
  onlineUsers,
  messages
});

const store = createStore(reducer, applyMiddleware(thunk, logger));

export default store;

export * from './auth';
export * from './onlineUsers';
export * from './messages';
