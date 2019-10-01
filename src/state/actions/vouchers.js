import api from 'src/api';

export const GET_VOUCHER = 'GET_VOUCHER';
export const EDIT_VOUCHER = 'EDIT_VOUCHER';

export const getVoucher = (voucherCode) => async (dispatch) => {
  try {
    const vouchers = await api.getVouchers({
      code: voucherCode
    });

    const voucher = Array.isArray(vouchers) && vouchers.length > 0 ? vouchers[0] : '';

    dispatch({
      type: GET_VOUCHER,
      voucher,
    });
    
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

    console.log(selectedReward);

    // Add reward to voucher and validate it
    await api.editVoucher({
      _id: selectedVoucher._id,
      reward_id: selectedReward._id,
      validated: true,
    });

    // Refreshes voucher in store
    dispatch(editVoucher({
      reward: selectedReward,
      validated: true,
    }))

    // Subtracts reward stock
    await api.subtractRewardStock(selectedReward._id);

  } catch(err) {
    console.error('actions/vouchers.js -> selectVoucherReward', err);
  }
}