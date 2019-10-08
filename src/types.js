const stringify = (obj_from_json) => {
  // In case of an array, we'll stringify all objects inside of it.
  if (Array.isArray(obj_from_json)) {
    return `[${
      obj_from_json
        .map(obj => `${stringify(obj)}`)
        .join(",")
    }]` ;
  }

  // If it is not an object, or it's a date, or it's NULL, stringify using native function
  if(typeof obj_from_json !== "object" || obj_from_json instanceof Date || obj_from_json === null) {
    return JSON.stringify(obj_from_json);
  }

  // Implements recursive object serialization according to JSON spec
  // but without quotes around the keys.
  return `{${
    Object
      .keys(obj_from_json)
      .map(key => `${key}:${stringify(obj_from_json[key])}`)
      .join(",")
    }}`;
};

// ========
// Vouchers
// ========

const GET_VOUCHERS = (inputFields = {}, returnFields = null) => `
{
  vouchers(voucher: ${stringify(inputFields)} ){
    ${returnFields ? returnFields : `
      _id
      code
      points
      validated
      reward {
        _id
        name
        description
        images
        stock
        company {
          name
          locations {
            name
            address
          }
        }
      }
      expiration_date
      created
    `}
  }
}`;

const EDIT_VOUCHER = (inputFields) => `
mutation{
  editVoucher(voucher: ${stringify(inputFields)} ){
    _id
  }
}`;

// =======
// Rewards
// =======

const GET_REWARDS = (inputFields = {}, returnFields = null) => `
{
  rewards(reward: ${stringify(inputFields)} ){
    ${returnFields ? returnFields : `
      _id
      name
      description
      stock
      images
      points
      vouchers {
        code
        emitted_date
      }
      company {
        _id
        name
        logo
        locations {
          name
          address
        }
      }
      created
    `}
  }
}`;

const EDIT_REWARD = (inputFields) => `
mutation{
  editReward(reward: ${stringify(inputFields)} ){
    _id
  }
}`;

const ADD_REWARD = (inputFields) => `
mutation{
  addReward(reward: ${stringify(inputFields)} ){
    _id
  }
}`;

const REMOVE_REWARD = (_id) => `
mutation{
  removeReward(reward: {
    _id: "${_id}"
  }){
    _id
  }
}`;

// =========
// Companies
// =========

const GET_COMPANIES = (inputFields = {}, returnFields = null) => `
{
  companies(company: ${stringify(inputFields)} ){
    ${returnFields ? returnFields : `
      _id
      name
      logo
      locations {
        name
        address
      }
    `}
  }
}`;

const ADD_COMPANY = (inputFields) => `
mutation{
  addCompany(company: ${stringify(inputFields)} ){
    _id
  }
}`;

const EDIT_COMPANY = (inputFields) => `
mutation{
  editCompany(company: ${stringify(inputFields)} ){
    _id
  }
}`;

const REMOVE_COMPANY = (_id) => `
mutation{
  removeCompany(company: {
    _id: "${_id}"
  }){
    _id
  }
}`;

export default {
  GET_VOUCHERS,
  ADD_REWARD,
  EDIT_VOUCHER,
  GET_REWARDS,
  REMOVE_REWARD,
  EDIT_REWARD,
  GET_COMPANIES,
  ADD_COMPANY,
  EDIT_COMPANY,
  REMOVE_COMPANY,
}