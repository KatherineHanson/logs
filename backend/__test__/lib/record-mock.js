'use strict'

const faker = require('faker')
const Record = require('../../model/record.js')

let create = ({ account }) => {
  return new Record({
    description: faker.lorem.words(3),
    category: faker.lorem.words(5),
    location: faker.lorem.words(3),
    account: account.account._id,
  }).save()
}

let createMany = ({ account, num: num = 10  }) => {

  return Promise.all(new Array(num).fill(0).map(() => create({ account })))
}

let remove = () => {
  return Promise.all([
    Record.remove({}),
  ])
}

module.exports = { create, createMany, remove }
