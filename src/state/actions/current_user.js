import { cookie } from 'src/helpers';

export const SET_CURRENT_USER = 'SET_CURRENT_USER';
export const UNSET_CURRENT_USER = 'UNSET_CURRENT_USER';

export const setCurrentUser = (user) => {
  console.log(user)
  return {
    type: SET_CURRENT_USER,
    user
  };
}

export const unsetCurrentUser = () => {
  cookie.delete('auth_token');
  return {
    type: UNSET_CURRENT_USER,
  }
}