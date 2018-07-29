import superagent from 'superagent'

export const set = (records) => ({
  type: 'RECORD_SET',
  payload: records,
})

export const add = (record) => ({
  type: 'RECORD_CREATE',
  payload: record,
})

export const remove = (record) => ({
  type: 'RECORD_REMOVE',
  payload: record,
})

export const change = (record) => ({
  type: 'RECORD_UPDATE',
  payload: record,
})

export const create = (record) => (store) => {
  let {token} = store.getState()
  return superagent.post(`${__API_URL__}/records`)
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json')
    .send(record)
    .then(res => {
      return store.dispatch(add(res.body))
    })
}

export const update = (record) => (store) => {
  let {token} = store.getState()
  return superagent.put(`${__API_URL__}/records/${record._id}`)
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json')
    .send(record)
    .then(res => {
      return store.dispatch(change(res.body))
    })
}

export const fetch = () => (store) => {
  let {token} = store.getState()
  return superagent.get(`${__API_URL__}/records`)
    .set('Authorization', `Bearer ${token}`)
    .then(res => {
      return store.dispatch(set(res.body))
    })
}

export const destroy = (record) => (store) => {
  let {token} = store.getState()
  return superagent.delete(`${__API_URL__}/records/${record._id}`)
    .set('Authorization', `Bearer ${token}`)
    .then(res => {
      return store.dispatch(remove(record))
    })
}
