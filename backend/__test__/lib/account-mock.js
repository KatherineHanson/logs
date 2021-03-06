'use strict'

const faker = require('faker')
const Account = require('../../model/account.js')

const accountMock = module.exports = {}

// Resolves -> request, account, token
accountMock.create = () => {
  let result = {
    request: {
      accountName: faker.company.companyName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    },
  }

  return Account.create(result.request)
    .then(account => {
      result.account = account
      return account.tokenCreate()
    })
    .then(token => {
      result.token = token
      return Account.findById(result.account._id)
    })
    .then(account => {
      result.account = account
      return result
    })
}

accountMock.remove = () => Account.remove({})
