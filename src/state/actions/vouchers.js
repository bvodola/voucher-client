import api from 'src/api';
import { showAlert } from './alerts'

export const GET_VOUCHER = 'GET_VOUCHER';
export const EDIT_VOUCHER = 'EDIT_VOUCHER';

export const getVoucher = (voucherCode) => async (dispatch) => {
  try {
    const vouchers = await api.getVouchers({
      code: voucherCode.toUpperCase()
    });

    const voucher = Array.isArray(vouchers) && vouchers.length > 0 ? vouchers[0] : '';

    dispatch({
      type: GET_VOUCHER,
      voucher,
    });

    localStorage.setItem('voucher_code', voucher.code || '');
    
    // Returns true if voucher was found and false otherwise
    return !(voucher === '');

  } catch(err) {
    console.error(err);
  }
};

export const editVoucher = (voucher) => {
  return {
    type: EDIT_VOUCHER,
    voucher
  }
}

export const selectVoucherReward = (selectedReward) => async (dispatch, getState) => {
  try {
    const { selectedVoucher } = getState().vouchers;

    if(selectedVoucher.points >= selectedReward.points) {
      // Add reward to voucher and validate it
      await api.editVoucher({
        _id: selectedVoucher._id,
        reward_id: selectedReward._id,
        emitted_date: String(Date.now()),
        validated: true,
      });

      // Refreshes voucher in local store
      dispatch(editVoucher({
        reward: selectedReward,
        emitted_date: String(Date.now()),
        validated: true,
      }))

      // Subtracts reward from stock
      await api.subtractRewardStock(selectedReward._id);
    } else {
      dispatch(showAlert('danger', 'Seu voucher não tem pontos suficientes para esta recompensa'));
    }

    

  } catch(err) {
    console.error('actions/vouchers.js -> selectVoucherReward', err);
  }
}