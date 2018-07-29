'use strict'

// Load mock environment
require('./lib/setup.js')

const superagent = require('superagent')
const server = require('../lib/server.js')
const accountMock = require('./lib/account-mock.js')

const apiURL = `http://localhost:${process.env.PORT}`

describe('AUTH router', () => {
  beforeAll(server.start)
  afterAll(server.stop)
  afterEach(accountMock.remove)

  describe('/admin/signup', () => {
    test('POST /admin/signup with 200', () => {
      return superagent.post(`${apiURL}/admin/signup`)
        .send({
          accountName: 'ChunkyCheese',
          email: 'TheChunks@yahoo.com',
          password: '1234password',
        })
        .then(res => {
          expect(res.status).toEqual(200)
          expect(res.body.token).toBeTruthy()
        })
    })

    test('POST /admin/signup with 400 (missing email)', () => {
      return superagent.post(`${apiURL}/admin/signup`)
        .send({
          accountName: 'ChunkyCheese',
          password: '1234password',
        })
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(400)
        })
    })

    test('POST /admin/signup with 409 (duplicate)', () => {
      return superagent.post(`${apiURL}/admin/signup`)
        .send({
          accountName: 'ChunkyCheese',
          email: 'TheChunks@yahoo.com',
          password: '1234password',
        })
        .then(() => {
          // Same username signing up
          return superagent.post(`${apiURL}/admin/signup`)
            .send({
              accountName: 'ChunkyCheese',
              email: 'TheChunks@yahoo.com',
              password: '1234password',
            })
        })
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(409)
        })
    })
  })

  describe('/admin/login', () => {
    test('GET /admin/login with 200',() => {
      return accountMock.create()
        .then(mock => {
          return superagent.get(`${apiURL}/admin/login`)
            .auth(mock.request.email, mock.request.password)
        })
        .then(res => {
          expect(res.status).toEqual(200)
          expect(res.body.token).toBeTruthy()
        })
    })

    test('GET /admin/login with 400 (basic auth required)',() => {
      return accountMock.create()
        .then(mock => {
          return superagent.get(`${apiURL}/admin/login`)
            .set('Authorization', `Bearer ${mock.token}`)
        })
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(400)
        })
    })

    test('GET /admin/login with 401 (wrong password)',() => {
      return accountMock.create()
        .then(mock => {
          return superagent.get(`${apiURL}/admin/login`)
            .auth(mock.request.email, 'lulwat')
        })
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(401)
        })
    })

    test('GET /admin/login with 404 (invalid username)',() => {
      return accountMock.create()
        .then(mock => {
          return superagent.get(`${apiURL}/admin/login`)
            .auth('ThisUserDoesNotExist', mock.request.password)
        })
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(404)
        })
    })
  })
})
