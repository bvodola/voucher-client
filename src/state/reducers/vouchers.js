import { GET_VOUCHER, EDIT_VOUCHER } from '../actions/vouchers';

const initialState = {
  selectedVoucher: '',
  vouchers: [],
}

export default (state = initialState, action) => {

  switch(action.type) {

    case GET_VOUCHER: {
      return {
        ...state,
        selectedVoucher: action.voucher,
      }
    }

    case EDIT_VOUCHER: {
      return {
        ...state,
        selectedVoucher: {
          ...state.selectedVoucher,
          ...action.voucher
        },
      }
    }

    default: {
      return { ...state }
    }
  }
}