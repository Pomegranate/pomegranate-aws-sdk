/**
 * @file loader
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate-Aws-Sdk
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';

const _ = require('lodash')
const Promise = require('bluebird')
const msg = require('./messages')

/**
 *
 * @module loader
 */

module.exports = function({Classes,APIs, Logger}){

  /**
   * The Main object created by this plugin, containing all of the configured AWS service instances
   * available for use by any downstream plugin.
   * @type {awsApis} AwsApis
   * @property {function} isAvailable
   * @property {object} AWS_Service_Name - A dynamic property storing the configured AWS API instance.
   * there will be one for every service listed in the options.awsApis array setting.
   */

  let awsApis = {}

  awsApis.isAvailable = function(serviceString){
    return _.isObject(this[serviceString])
  }

  _.reduce(APIs, (obj,item) => {
    let prop
    let opts = null


    if(_.isObject(item)){
      if(!_.has(item, 'name')){
        Logger.warn(msg.NO_NAME)
        return obj
      }

      prop = item.name
      if(_.has(item, 'options')){
        opts = item.options
      }
    }
    else if(_.isString(item)){
      prop = item
    }
    else {
      Logger.warn(msg.NOT_VALID)
      return obj
    }

    let cls = Classes[prop]
    if(!cls){throw new Error(msg.NO_MOCK(prop))}

    if(!_.isFunction(cls)){
      Logger.warn(msg.NOT_AVAILABLE(item))
      return
    }
    Logger.log(msg.LOADED(prop))
    obj[prop] = opts ? Promise.promisifyAll(new cls(opts)) : Promise.promisifyAll(new cls())
    return obj

  }, awsApis)

  return awsApis

}