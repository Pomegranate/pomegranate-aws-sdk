/**
 * @file index
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate-Aws-Sdk
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const _fp = require('lodash/fp')
/**
 *
 * @module index
 */

const classProps = (obj) =>{
  let p = Object.getOwnPropertyNames(obj.__proto__)
  return _fp.filter((o)=> o !== 'constructor', p)
}

const findIntersection = (original, pending) => {
  let O = classProps(original)
  let P = classProps(pending)
  return _fp.intersection(O, P)
}

module.exports = {
  authKeys: (Env) => (_fp.has('AWS_ACCESS_KEY_ID', Env) && _fp.has('AWS_SECRET_ACCESS_KEY', Env)),
  profile: (Env) => (_fp.has('AWS_PROFILE', Env)),
  noAuthKeys: function(Env){
    return (!_fp.has('AWS_ACCESS_KEY_ID', Env) || !_fp.has('AWS_SECRET_ACCESS_KEY', Env))
  },
  noProfile: function(Env){
    return (!_fp.has('AWS_PROFILE', Env))
  },
  noMockDupes: (original, pending) => {
    return findIntersection(original, pending)
  }
}