import { SET_CURRENT_USER, UNSET_CURRENT_USER } from '../actions/current_user';

const initialState = {
  loggedIn: false,
  _id: '',
  token: '',
}

export default (state = initialState, action) => {

  switch(action.type) {

    case SET_CURRENT_USER: {
      console.log(action)
      return {
        ...state,
        loggedIn: true,
        _id: action.user._id,
        email: action.user.email,
        token: action.user.tokens.local,
      }
    }

    case UNSET_CURRENT_USER: {
      return {
        ...initialState
      }
    }

    default: {
      return { ...state }
    }
  }
}