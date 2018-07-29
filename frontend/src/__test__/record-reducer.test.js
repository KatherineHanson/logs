import reducer from '../reducer/record.js'

describe('Record reducer', () => {

  test('The initial state should be data:[] and count: 0', () => {
    let state = reducer(undefined, {type: ''})
    expect(state.data).toEqual([])
    expect(state.count).toBe(0)
  })

  describe('RECORD_SET', () => {
    test('Should set the Record array and Count', () => {
      let action  = {
        type: 'RECORD_SET',
        payload: {
          count: 2,
          data: ['test1', 'test2'],
        },
      }
      let state = reducer(undefined, action)
      expect(state).toEqual(action.payload)
    })

    test('should fail with no payload', () => {
      let shouldFail = () => {
        reducer(undefined, {type: 'RECORD_SET'})
      }
      expect(shouldFail).toThrow('records required')
    })

    test('should fail with invalid payload', () => {
      let shouldFail = () => {
        reducer(undefined, {
          type: 'RECORD_SET',
          payload: {},
        })
      }
      expect(shouldFail).toThrow('__VALIDATION_ERROR__ invalid records')
    })
  })

  describe('RECORD_CREATE', () => {
    test('Should add a record to record array and increment count', () => {
      let action = {
        type: 'RECORD_CREATE',
        payload: {description: 'hello', location: 'new york'},
      }

      let state = reducer(undefined, action)
      expect(state.data[0].description).toBe('hello')
      expect(state.data[0].location).toBe('new york')
      expect(state.count).toBe(1)
    })

    test('Should fail with no payload', () => {
      let shouldFail = () => {
        reducer(undefined, {type: 'RECORD_CREATE'})
      }
      expect(shouldFail).toThrow('record required')
    })

    test('should fail with invalid payload', () => {
      let shouldFail = () => {
        reducer(undefined, {
          type: 'RECORD_CREATE',
          payload: {},
        })
      }
      expect(shouldFail).toThrow('__VALIDATION_ERROR__ invalid record')
    })
  })

  describe('RECORD_UPDATE', () => {
    test('Should update an existing record in record array', () => {
      let initialState = {
        count: 2,
        data: [{_id: 1, description: 'hello', location: 'beijing'}, {_id: 2, description: 'world', location: 'nairobi'}],
      }
      let action = {
        type: 'RECORD_UPDATE',
        payload: {description: 'hello', location: 'boca', _id: 1},
      }

      let state = reducer(initialState, action)
      expect(state.data[0].description).toBe('hello')
      expect(state.data[0].location).toBe('boca')
      expect(state.count).toBe(2)
    })

    test('Should fail with no payload', () => {
      let shouldFail = () => {
        reducer(undefined, {type: 'RECORD_UPDATE'})
      }
      expect(shouldFail).toThrow('record required')
    })

    test('should fail with invalid payload', () => {
      let shouldFail = () => {
        reducer(undefined, {
          type: 'RECORD_UPDATE',
          payload: {},
        })
      }
      expect(shouldFail).toThrow('__VALIDATION_ERROR__ invalid record')
    })
  })

  describe('RECORD_REMOVE', () => {
    test('Should remove an existing record in record array and decrement count', () => {
      let initialState = {
        count: 2,
        data: [{_id: 1, description: 'hello', location: 'lima'}, {_id: 2, description: 'world', location: 'seattle'}],
      }
      let action = {
        type: 'RECORD_REMOVE',
        payload: {description: 'hello', location: 'lima', _id: 1},
      }

      let state = reducer(initialState, action)
      expect(state.data.length).toBe(1)
      expect(state.count).toBe(1)
    })

    test('Should fail with no payload', () => {
      let shouldFail = () => {
        reducer(undefined, {type: 'RECORD_REMOVE'})
      }
      expect(shouldFail).toThrow('record required')
    })

    test('should fail with invalid payload', () => {
      let shouldFail = () => {
        reducer(undefined, {
          type: 'RECORD_REMOVE',
          payload: {},
        })
      }
      expect(shouldFail).toThrow('__VALIDATION_ERROR__ invalid record')
    })
  })

  test('should return emptyState on TOKEN_REMOVE', () => {
    let initialState = {
      count: 2,
      data: [{_id: 1, description: 'hello', location: 'snohomish'}, {_id: 2, description: 'world', location: 'vancouver'}],
    }
    let state = reducer(initialState, {type: 'TOKEN_REMOVE'})
    expect(state.data).toEqual([])
    expect(state.count).toBe(0)
  })

  test('should return the state', () => {
    let state = reducer('hello world', {type: ''})
    expect(state).toEqual('hello world')
  })
})
