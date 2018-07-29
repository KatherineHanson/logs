export const validateRecord = (record) => {
  if(!record)
    throw new Error('record required')
  let {description, location} = record
  if(!description || !location)
    throw new Error('__VALIDATION_ERROR__ invalid record')
}

export const validateRecords = (record) => {
  if(!record)
    throw new Error('records required')
  if(!record.data || record.count === undefined)
    throw new Error('__VALIDATION_ERROR__ invalid records')
}

const emptyState = {
  count: 0,
  data: [],
}

export default (state=emptyState, {type, payload}) => {
  let temp, tempArray
  switch(type){
    case 'RECORD_SET':
      validateRecords(payload)
      return payload
    case 'RECORD_CREATE':
      validateRecord(payload)
      temp = {...state}
      temp.count = state.count + 1
      temp.data = [...state.data, payload]
      return temp
    case 'RECORD_UPDATE':
      validateRecord(payload)
      temp = {...state}
      tempArray = state.data.map(record => record._id===payload._id ? payload : record)
      temp.data = tempArray
      return temp
    case 'RECORD_REMOVE':
      validateRecord(payload)
      temp = {...state}
      tempArray = state.data.filter(record => record._id !== payload._id)
      temp.count = state.count - 1
      temp.data = tempArray
      return temp
    case 'TOKEN_REMOVE':
      return emptyState
    default:
      return state
  }
}
