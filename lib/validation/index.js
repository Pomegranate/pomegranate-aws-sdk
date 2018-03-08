/**
 * @file index
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate-Aws-Sdk
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const _ = require('lodash')

/**
 *
 * @module index
 */

const classProps = (obj) =>{
  let p = Object.getOwnPropertyNames(obj.__proto__)
  return _.filter(p, (o)=> o !== 'constructor')
}

const findIntersection = (original, pending) => {
  let O = classProps(original)
  let P = classProps(pending)
  return _.intersection(O, P)
}

module.exports = {
  authKeys: (Env) => (_.has(Env, 'AWS_ACCESS_KEY_ID') && _.has(Env, 'AWS_SECRET_ACCESS_KEY')),
  profile: (Env) => (_.has(Env, 'AWS_PROFILE')),
  noAuthKeys: function(Env){
    return (!_.has(Env, 'AWS_ACCESS_KEY_ID') || !_.has(Env, 'AWS_SECRET_ACCESS_KEY'))
  },
  noProfile: function(Env){
    return (!_.has(Env, 'AWS_PROFILE'))
  },
  noMockDupes: (original, pending) => {
    return findIntersection(original, pending)
  }
}