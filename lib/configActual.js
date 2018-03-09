/**
 * @file configActual
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate-Aws-Sdk
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const Promise = require('bluebird')
const _fp = require('lodash/fp')
const msg = require('./messages')

/**
 *
 * @module configActual
 */

module.exports = function({AWS, options, Logger}){
  return Promise.try(() => {
    if(!_fp.isArray(options.awsApis)){
      throw(new Error(msg.NOT_ARRAY))
    }

    if(!options.awsApis.length){
      Logger.warn('No AWS APIS are configured to load via this plugins settings.')
      Logger.warn('Add needed AWS APIs to the setting "AwsApis" in the settings file.')
    }

    if(_fp.isObject(options.awsConfig)){
      Logger.log('Updating AWS configuration with provided values.')
      AWS.config.update(options.awsConfig)
    }

    if(_fp.isObject(options.apiVersions)){
      Logger.log('Updating AWS api versions with provided values.')
      AWS.config.apiVersions = options.apiVersions
    }

    return AWS
  })


}