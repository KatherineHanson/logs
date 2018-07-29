'use strict'

require('./lib/setup.js')

const faker = require('faker')
const superagent = require('superagent')
const server = require('../lib/server.js')
const accountMock = require('./lib/account-mock.js')
const recordMock = require('./lib/record-mock.js')

const apiURL = `${process.env.API_URL}`

describe('/records', () => {
  beforeAll(server.start)
  afterAll(server.stop)
  afterEach(accountMock.remove)
  afterEach(recordMock.remove)

  describe('POST /records', () => {
    test('200 OK should create a record', () => {
      let tempAccount
      return accountMock.create()
        .then(mock => {
          tempAccount = mock
          return superagent.post(`${apiURL}/records`)
            .set('Authorization', `Bearer ${tempAccount.token}`)
            .send({
              description: 'carrots',
              category: 'health',
              location: 'tokyo',
            })
        })
        .then(res => {
          expect(res.status).toEqual(200)
          expect(res.body.description).toEqual('carrots')
          expect(res.body.category).toEqual('health')
          expect(res.body.location).toEqual('tokyo')
        })

    })

    test('400 Record didn\'t receive any values', () => {
      let tempAccount
      return accountMock.create()
        .then(mock => {
          tempAccount = mock
          return superagent.post(`${apiURL}/records`)
            .set('Authorization', `Bearer ${tempAccount.token}`)
        })
        .then(Promise.reject)
        .catch(res => {
          console.log(res.body)
          expect(res.status).toEqual(400)
        })

    })

    test('401 Bad token', () => {
      return accountMock.create()
        .then(() => {
          return superagent.post(`${apiURL}/records`)
            .set('Authorization', `Bearer bad token`)
        })
        .then(Promise.reject)
        .catch(res => {
          console.log(res.body)
          expect(res.status).toEqual(401)
        })

    })
  })

  describe('GET /records', () => {
    test('200 OK should return a bunch of records', () => {
      let tempMock
      return accountMock.create()
        .then(mock => {
          tempMock = mock
          return recordMock.createMany({ account: mock, num: 30 })
        })
        .then(() => {
          return superagent.get(`${apiURL}/records`)
            .set('Authorization', `Bearer ${tempMock.token}`)
        })
        .then(res => {
          expect(res.status).toEqual(200)
          expect(res.body.count).toEqual(30)
        })
    })

    test('200 OK should return some description fuzzies', () => {
      let tempMock
      return accountMock.create()
        .then(mock => {
          tempMock = mock
          return recordMock.createMany({ account: mock, num: 30 })
        })
        .then(() => {
          return superagent.get(`${apiURL}/records`)
            .set('Authorization', `Bearer ${tempMock.token}`)
            .query({ description: 'h' })
        })
        .then(res => {
          expect(res.status).toEqual(200)
          expect(res.body.count).toBeLessThan(30)
        })
    })

    test('200 OK should return some category fuzzies', () => {
      let tempMock
      return accountMock.create()
        .then(mock => {
          tempMock = mock
          return recordMock.createMany({ account: mock, num: 30 })
        })
        .then(() => {
          return superagent.get(`${apiURL}/records`)
            .set('Authorization', `Bearer ${tempMock.token}`)
            .query({ category: 'h' })
        })
        .then(res => {
          expect(res.status).toEqual(200)
          expect(res.body.count).toBeLessThan(30)
        })
    })

    test('200 OK page should return NaN', () => {
      let tempMock
      return accountMock.create()
        .then(mock => {
          tempMock = mock
          return recordMock.create({ account: mock, num: 30 })
        })
        .then(() => {
          return superagent.get(`${apiURL}/records?page=hello`)
            .set('Authorization', `Bearer ${tempMock.token}`)
        })
        .then(res => {
          expect(res.status).toEqual(200)
        })
    })

    test('200 OK page should be less than 0', () => {
      let tempMock
      return accountMock.create()
        .then(mock => {
          tempMock = mock
          return recordMock.create({ account: mock, num: 30 })
        })
        .then(() => {
          return superagent.get(`${apiURL}/records?page=-1`)
            .set('Authorization', `Bearer ${tempMock.token}`)
        })
        .then(res => {
          expect(res.status).toEqual(200)
        })
    })

    test('200 OK page should be 1', () => {
      let tempMock
      return accountMock.create()
        .then(mock => {
          tempMock = mock
          return recordMock.create({ account: mock, num: 30 })
        })
        .then(() => {
          return superagent.get(`${apiURL}/records?page=1`)
            .set('Authorization', `Bearer ${tempMock.token}`)
        })
        .then(res => {
          expect(res.status).toEqual(200)
        })
    })

    test('401 Not authorized, bad token', () => {
      return accountMock.create()
        .then(mock => {

          return recordMock.create({ account: mock })
        })
        .then(() => {
          return superagent.get(`${apiURL}/records`)
            .set('Authorization', `Bearer bad token`)
        })
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(401)
        })
    })

    test('404 Record not found ', () => {
      let tempMock
      return accountMock.create()
        .then(mock => {
          tempMock = mock
          return recordMock.create({ account: mock })
        })
        .then(() => {
          return superagent.get(`${apiURL}/badpath`)
            .set('Authorization', `Bearer ${tempMock.token}`)
        })
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(404)
        })
    })


  })

  describe('PUT /records/:id', () => {
    test('200 OK Record updated', () => {
      let tempMock
      return accountMock.create()
        .then(mock => {
          tempMock = mock
          return recordMock.create({ account: mock })
        })
        .then(record => {
          return superagent.put(`${apiURL}/records/${record._id}`)
            .set('Authorization', `Bearer ${tempMock.token}`)
            .send({
              description: 'banana',
              category: 'potassium',
            })
        })
        .then(res => {
          expect(res.status).toEqual(200)
          expect(res.body.description).toEqual('banana')
          expect(res.body.category).toEqual('potassium')
        })
    })

    test('400 Bad Input, need to send a record description', () => {
      let tempMock
      return accountMock.create()
        .then(mock => {
          tempMock = mock
          return recordMock.create({ account: mock })
        })
        .then(record => {
          return superagent.put(`${apiURL}/records/${record._id}`)
            .set('Authorization', `Bearer ${tempMock.token}`)
            .send({
              category: 'potassium',
            })
        })
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(400)
        })
    })

    test('400 Bad Input, need to send a description', () => {
      return accountMock.create()
        .then(mock => {
          return recordMock.create({ account: mock })
        })
        .then(record => {
          return superagent.put(`${apiURL}/records/${record._id}`)
            .send({
              description: 'pineapple',
            })
        })
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(400)
        })
    })

    test('401 Bad token set', () => {
      return accountMock.create()
        .then(mock => {
          return recordMock.create({ account: mock })
        })
        .then(record => {
          return superagent.put(`${apiURL}/records/${record._id}`)
            .set('Authorization', `Bearer bad token`)
        })
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(401)
        })
    })

    test('404 record not found', () => {
      let tempMock
      return accountMock.create()
        .then(mock => {
          tempMock = mock
          return recordMock.create({ account: mock })
        })
        .then(() => {
          return superagent.put(`${apiURL}/records/thisIsNotAThing`)
            .set('Authorization', `Bearer ${tempMock.token}`)
            .send({
              description: 'banana',
              category: 'potassium',
            })
        })
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(404)
        })
    })
  })

  describe('DELETE /records/:id', () => {
    test('204 Record deleted', () => {
      let tempMock
      return accountMock.create()
        .then(mock => {
          tempMock = mock
          return recordMock.create({ account: mock })
        })
        .then(record => {
          return superagent.delete(`${apiURL}/records/${record._id}`)
            .set('Authorization', `Bearer ${tempMock.token}`)
        })
        .then(res => {
          expect(res.status).toEqual(204)
        })
    })

    test('400 no bearer authorization sent', () => {
      return accountMock.create()
        .then(mock => {
          return recordMock.create({ account: mock })
        })
        .then(record => {
          return superagent.delete(`${apiURL}/records/${record._id}`)
        })
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(400)
        })
    })

    test('401 bad token', () => {
      return accountMock.create()
        .then(mock => {
          return recordMock.create({ account: mock })
        })
        .then(record => {
          return superagent.delete(`${apiURL}/records/${record._id}`)
            .set('Authorization', `Bearer bad token`)
        })
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(401)
        })
    })

    test('404 Record not found', () => {
      let tempMock
      return accountMock.create()
        .then(mock => {
          tempMock = mock
          return recordMock.create({ account: mock })
        })
        .then(() => {
          return superagent.delete(`${apiURL}/records/notAThing`)
            .set('Authorization', `Bearer ${tempMock.token}`)
        })
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(404)
        })
    })
  })
})

