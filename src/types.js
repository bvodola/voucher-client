const generateInputFieldsString = (inputFields) => (
  Object.keys(inputFields).reduce((t, c) => {
    if (typeof inputFields[c] === 'object' && Array.isArray(inputFields[c])) return `${t}  ${c}: [${generateInputFieldsString(inputFields[c])}]`
    else if (inputFields[c]instanceof Date) return `${t} ${c}: "${inputFields[c]}"`
    else if (typeof inputFields[c] === 'object' && inputFields[c]) return `${t}  ${c}: {${generateInputFieldsString(inputFields[c])}}`
    else if (typeof inputFields[c] === 'number') return `${t} ${c}: ${inputFields[c]}`
    else return `${t} ${c}: "${inputFields[c]}"`
  }, '')
).trim();

const generateArrayString = (items) => {
  let as = items.reduce((t,c)=> `${t}"${c}",`,'');
  as = `[${as.substr(0,as.length-1)}]`;
  return as;
}

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


const USERS = (inputFields = {}) => `
{
  users(user: {${generateInputFieldsString(inputFields)}}){
    _id
    name
    email
    phone
    company {_id name}
  }
}`;

const ADD_USER = (inputFields) => `
mutation {
  addUser(user: {
    ${generateInputFieldsString(inputFields)}
  }){
    _id
    name
    phone
    company {_id name}
  }
}`;

const CLIENT = ({_id}) => `
{
  client(_id: "${_id}"){
    _id name email user{_id name} created
  }
}`;

const CLIENTS = ({list_ids, ...inputFields} = {}, returnFields = null) => `
{
  clients(client: {
    ${ Array.isArray(list_ids) ? `list_ids: ${generateArrayString(list_ids)}` : ''}
    ${generateInputFieldsString(inputFields)}
  }){
    
    ${returnFields ? returnFields : `
      _id
      name
      mentionName
      phone
      lists {_id name color textColor}
    `}
  }
}`;

const CLIENTS_FROM_USER = ({user_id}) => `
{
  clients(client: {user_id: "${user_id}"}){
    _id
    name
    mentionName
    phone
    lists {_id name color textColor}
  }
}`;

const ADD_CLIENT = (inputFields) =>  `
mutation {
  addClient(client: {
    ${generateInputFieldsString(inputFields)}
  }){
    _id
  }
}`;

const EDIT_CLIENT = ({list_ids, ...inputFields}) =>`
mutation {
  editClient(client: {
    list_ids: ${generateArrayString(list_ids)}
    ${generateInputFieldsString(inputFields)}
  }){
    _id
    name
    mentionName
    phone
    lists{
      _id
      name
      color
      textColor
    }
  }
}`;

const LISTS_FROM_COMPANY = ({company_id}) => `
{
  lists(list: {company_id: "${company_id}"}){
    _id
    name
    color
    textColor
  }
}`;

const ADD_LIST = (inputFields) => `
mutation{
  addList(list: {
    ${generateInputFieldsString(inputFields)}
  }){
    _id
  }
}`;

const EDIT_LIST = ({_id, ...inputFields}) => `
mutation{
  editList(list: {
    ${generateInputFieldsString(inputFields)}
  }){
    _id
  }
}`;

const REMOVE_LIST = (_id) => `
mutation{
  removeList(list: {
    _id: "${_id}"
  }){
    _id
  }
}`;

const ADD_COMPANY = (inputFields) =>  `
mutation {
  addCompany(company: {
    ${generateInputFieldsString(inputFields)}
  }){
    _id
    name
  }
}`;

const EDIT_COMPANY = (inputFields) =>  `
mutation {
  editCompany(company: {
    ${generateInputFieldsString(inputFields)}
  }){
    _id
  }
}`;

// ========
// Messages
// ========

const MESSAGES = (inputFields = {}) => `
{
  messages(message: {${generateInputFieldsString(inputFields)}}){
    _id
    sent
    sendDate
    created
    phone
    content
    lists {_id name color textColor}
  }
}`;

const ADD_MESSAGE = ({list_ids, ...inputFields} = {}) =>  `
mutation {
  addMessage(message: {
    ${ Array.isArray(list_ids) ? `list_ids: ${generateArrayString(list_ids)}` : ''}
    ${generateInputFieldsString(inputFields)}
  }){
    _id
  }
}`;

const REMOVE_MESSAGE = (_id) => `
mutation{
  removeMessage(message: {
    _id: "${_id}"
  }){
    _id
  }
}`;

// =========
// Sequences
// =========
const SEQUENCES = (inputFields = {}) => `
{
  sequences(sequence: {${generateInputFieldsString(inputFields)}}){
    _id
    name
    messages {
      content
      trigger {
        trigger_type
        type_id
        type_index
        delay
        date
      }
    }
  }
}`;

const ADD_SEQUENCE = (inputFields = {}) =>  `
mutation {
  addSequence(sequence: ${stringify(inputFields)} ){
    _id
  }
}`;

const ADD_SEQUENCE_MESSAGES = (inputArray = []) =>  `
mutation {
  addSequenceMessages(sequenceMessages: [
    ${inputArray.reduce((t,c) => `${t} { ${generateInputFieldsString(c)} }`, '')}
  ]){
    _id
  }
}`;

const REMOVE_SEQUENCE = (_id) => `
mutation{
  removeSequence(sequence: {
    _id: "${_id}"
  }){
    _id
  }
}`;

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
      company {
        _id
        name
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

export default {
  USERS,
  ADD_USER,
  CLIENT,
  CLIENTS,
  CLIENTS_FROM_USER,
  ADD_CLIENT,
  EDIT_CLIENT,
  LISTS_FROM_COMPANY,
  ADD_LIST,
  EDIT_LIST,
  REMOVE_LIST,
  ADD_COMPANY,
  EDIT_COMPANY,
  MESSAGES,
  ADD_MESSAGE,
  REMOVE_MESSAGE,
  SEQUENCES,
  ADD_SEQUENCE,
  ADD_SEQUENCE_MESSAGES,
  REMOVE_SEQUENCE,

  GET_VOUCHERS,
  EDIT_VOUCHER,
  GET_REWARDS,
  EDIT_REWARD,
}