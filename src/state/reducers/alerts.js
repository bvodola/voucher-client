import { SHOW_ALERT, HIDE_ALERT } from '../actions/alerts';

const initialState = {
  show: false,
  alertType: '',
  content: ''
}

export default (state = initialState, action) => {

  switch(action.type) {

    case SHOW_ALERT: {
      return {
        ...state,
        show: true,
        alertType: action.alertType,
        content: action.content,
      }
    }

    case HIDE_ALERT: {
      return {
        ...state,
        show: false,
      }
    }

    default: {
      return { ...state }
    }
  }
}