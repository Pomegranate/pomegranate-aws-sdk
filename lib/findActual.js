/**
 * @file findActual
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate-Aws-Sdk
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */


'use strict';

const Promise = require('bluebird')
const msg = require('./messages')
const validation = require('./validation')
/**
 * Checks actual AWS Authentication method
 * @module findActual
 */

/**
 *
 * @param Env
 * @param Logger
 * @returns {*|PromiseLike<T>|Promise<T>}
 */
module.exports = function({Env, Logger}){
  let AWS = require('aws-sdk')
  let Cr = Promise.promisifyAll( new AWS.Config() )
  if(!Cr.credentials){
    Logger.warn(msg.WARN_NO_SYNC)
  }
  if(validation.noProfile(Env)){
    Logger.log(msg.NO_PROFILE)
  }

  if(validation.noAuthKeys(Env)){
    Logger.log(msg.NO_ENVS)
  }

  return Cr.getCredentialsAsync()
    .then((credentials) => {
      if(credentials){
        if(credentials instanceof AWS.SharedIniFileCredentials){
          Logger.log(msg.USING_FILE(credentials.profile))
        }
        if(credentials instanceof AWS.EnvironmentCredentials){

        }
        if(credentials instanceof AWS.EC2MetadataCredentials){

        }
      }

      return AWS
    })
}