import { combineReducers } from 'redux';
import alerts from './alerts';
import current_user from './current_user'
import vouchers from './vouchers';

const reducers = combineReducers({
  alerts,
  current_user,
  vouchers,
});

export default reducers;