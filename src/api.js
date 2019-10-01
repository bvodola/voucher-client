import axios from 'axios';
import types from 'src/types';
import store from 'src/state/store';
import config from 'src/config';
const {BACKEND_URL} = config;

const getCurrentUserId = () => store.getState().user.currentUser._id || '';
const getCurrentUserCompanyId = () => store.getState().user.currentUser.company._id || '';

// =====
// Users
// =====
const getUsers = async (fields = {}) => {
  try {
    const res = await axios.post(
      `${BACKEND_URL}/graphql`,
      { query: `${types.USERS(fields)}` }
    )
    return res.data.data.users;
  } catch(err) {
    throw err;
  }
}

// =======
// Clients
// =======
const getClients = async (fields = {}, returnFields = null) => {
  try {
    const res = await axios.post(
      `${BACKEND_URL}/graphql`,
      { query: `${types.CLIENTS({user_id: getCurrentUserId(), ...fields}, returnFields)}` }
    )
    return res.data.data.clients;
  } catch(err) {
    throw err;
  }
}

const addClient = async (client) => {
  try {
    client = {
      ...client,
      user_id: getCurrentUserId(),
      company_id: getCurrentUserCompanyId(),
    };

    const res = await axios.post(
      `${BACKEND_URL}/graphql`,
      { query: `${types.ADD_CLIENT(client)}` }
    )
    return res.data.data;
  } catch(err) {
    throw err;
  }
}

const editClient = async (client) => {
  try {
    const res = await axios.post(
      `${BACKEND_URL}/graphql`,
      { query: `${types.EDIT_CLIENT(client)}` }
    )
    return res.data.data;
  } catch(err) {
    throw err;
  }
}

// ========
// Messages
// ========

const getMessages = async (fields = {}) => {
  try {
    const res = await axios.post(
      `${BACKEND_URL}/graphql`,
      { query: `${types.MESSAGES({user_id: getCurrentUserId(), ...fields})}` }
    )
    return res.data.data.messages;
  } catch(err) {
    throw err;
  }
}

const addMessage = async (fields) => {
  try {
    let entry = {
      ...fields,
      user_id: getCurrentUserId(),
      company_id: getCurrentUserCompanyId(),
    };

    const res = await axios.post(
      `${BACKEND_URL}/graphql`,
      { query: `${types.ADD_MESSAGE(entry)}` }
    )
    return res.data.data.addMessage;
    
  } catch(err) {
    throw err;
  }
}

const removeMessage = async(_id) => {
  try {
    const res = await axios.post(
      `${BACKEND_URL}/graphql`,
      { query: `${types.REMOVE_MESSAGE(_id)}` }
    )
  } catch(err) {
    throw err;
  }
}

// =====
// Lists
// =====
const getLists = async () => {
  try {
    const res = await axios.post(
      `${BACKEND_URL}/graphql`,
      { query: `${types.LISTS_FROM_COMPANY({company_id: getCurrentUserCompanyId()})}` }
    )
    return res.data.data.lists;
  } catch(err) {
    throw err;
  }
}

const editList = async (list) => {
  try {
    const res = await axios.post(
      `${BACKEND_URL}/graphql`,
      { query: `${types.EDIT_LIST(list)}` }
    )
    return res.data.data;
  } catch(err) {
    throw err;
  }
}

// =========
// Sequences
// =========

const getSequences = async (fields = {}) => {
  try {
    const res = await axios.post(
      `${BACKEND_URL}/graphql`,
      { query: `${types.SEQUENCES({user_id: getCurrentUserId(), ...fields})}` }
    )
    return res.data.data.sequences;
  } catch(err) {
    throw err;
  }
}

const addSequence = async (fields) => {
  try {
    let entry = {
      ...fields,
      user_id: getCurrentUserId(),
      company_id: getCurrentUserCompanyId(),
    };

    const res = await axios.post(
      `${BACKEND_URL}/graphql`,
      { query: `${types.ADD_SEQUENCE(entry)}` }
    )
    return res.data.data.addSequence;
    
  } catch(err) {
    throw err;
  }
}

const addSequenceMessages = async (sequence_id, sequenceMessages) => {
  try {
    let entry = sequenceMessages.map(sm => {
      return {
        sequence_id,
        ...sm,
      }
    });

    console.log(entry)

    const res = await axios.post(
      `${BACKEND_URL}/graphql`,
      { query: `${types.ADD_SEQUENCE_MESSAGES(entry)}` }
    )
    console.log(res)
    return res.data.data.addSequenceMessages;
    
  } catch(err) {
    throw err;
  }
}

const removeSequence = async(_id) => {
  try {
    const res = await axios.post(
      `${BACKEND_URL}/graphql`,
      { query: `${types.REMOVE_SEQUENCE(_id)}` }
    )
  } catch(err) {
    throw err;
  }
}

// ========
// Vouchers
// ========
const getVouchers = async (fields = {}) => {
  try {
    return get('vouchers', fields);
  } catch(err) {
    throw err;
  }
}

const editVoucher = async (fields = {}) => {
  console.log(fields);
  try {
    return edit('voucher', fields);
  } catch(err) {
    throw err;
  }
}

// =======
// Rewards
// =======
const getRewards = async (fields = {}) => {
  try {
    return get('rewards', fields);
  } catch(err) {
    throw err;
  }
}

const editReward = async (fields = {}) => {
  console.log(fields);
  try {
    return edit('reward', fields);
  } catch(err) {
    throw err;
  }
}

const subtractRewardStock = async (reward_id) => {
  try {
    const reward = (await getRewards({_id: reward_id}))[0];
    
    await editReward({
      _id: reward_id,
      stock: reward.stock - 1
    });

  } catch(err) {
    throw err;
  }
}


// =================
// Generic functions
// =================
const get = async (model, fields = {}) => {
  try {
    const MODEL = model.toUpperCase();
    const res = await axios.post(
      `${BACKEND_URL}/graphql`,
      { query: `${types[`GET_${MODEL}`](fields)}` }
    )
    return res.data.data[model];

  } catch(err) {
    throw err;
  }
}

const edit = async (model, fields) => {
  try {
    const MODEL = model.toUpperCase();
    const res = await axios.post(
      `${BACKEND_URL}/graphql`,
      { query: `${types[`EDIT_${MODEL}`](fields)}` }
    )
    return res.data.data;
  } catch(err) {
    throw err;
  }
}


const api = {
  getUsers,
  getClients,
  addClient,
  editClient,
  getMessages,
  removeMessage,
  addMessage,
  getLists,
  editList,
  getSequences,
  addSequence,
  addSequenceMessages,
  removeSequence,

  getVouchers,
  editVoucher,
  getRewards,
  editReward,
  subtractRewardStock,
}

export default api;