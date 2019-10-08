export const SHOW_ALERT = 'SHOW_ALERT';
export const HIDE_ALERT = 'HIDE_ALERT';

export const showAlert = (alertType, content) => async (dispatch) => {
  dispatch({
    type: SHOW_ALERT,
    show: true,
    alertType,
    content,
  });

  setTimeout(() => {
    dispatch(hideAlert());
  }, 3000)
}

export const hideAlert = () => {
  return {
    type: HIDE_ALERT,
    show: false,
  }
}