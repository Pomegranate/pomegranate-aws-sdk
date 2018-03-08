/**
 * @file ./lib/loader.js
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate-Aws-Sdk
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';

const _ = require('lodash')
const Promise = require('bluebird')
const msg = require('./messages')
const validation = require('./validation')


module.exports = function({Classes,APIs, Logger, usingMocks}){

  /**
   * The Main object created by this plugin, containing all of the configured AWS service instances
   * available for use by any downstream plugin.
   * @property {object} AWS_Service_Name - A dynamic property storing the configured AWS API instance.
   * there will be one for every service listed in the options.awsApis array setting.
   */

  let awsApis = {}

  /**
   * Determines if an AWS API is available on the injector
   * @method
   * @param {string} serviceString
   * @returns {boolean}
   * @example
   * let AWS = inject('AWS')
   * let hasS3 = AWS.isAvailable('S3') // true
   */
  awsApis.isAvailable = function(serviceString){
    return _.isObject(this[serviceString])
  }

  /**
   * Allows downstream plugins to add additional AWS service APis to this plugins injectable object.
   * @param {Object} opts
   * @param {string} opts.AwsApi - The AWS API class that will be added.
   * @param {Object} opts.Opts - Options to pass to the requested API Class during instantiation
   * @param {Object} opts.MockClass - Only used when the AwsSDK plugin has "useMocks: true"
   * @returns {boolean} - true if added, false if it already existed.
   * @example
   * let S3Mock = require('some/mock/class.js')
   * let AWS = inject('AWS')
   * AWS.addApiObject({AwsApi: 'S3', MockClass: S3Mock})
   * AWS.S3.listBuckets()
   *   .then(console.log)
   *
   */
  awsApis.addApiObject = function({AwsApi, Opts = {}, MockClass}){
    if(usingMocks){
      let pendingObject = Opts ? Promise.promisifyAll(new MockClass(Opts)) : Promise.promisifyAll(new MockClass())

      if(this.isAvailable(AwsApi)){
        Logger.warn(`Attempting to merge duplicate mocks for ${AwsApi}`)
        let originalObject = this[AwsApi]
        let duplicateMethods = validation.noMockDupes(originalObject,pendingObject)
        if(duplicateMethods.length){
          Logger.error(`Cannot merge mocks, duplicate methods present: ${duplicateMethods.join(',')}`)
          throw new Error('Attempted to merge duplicate mock objects.')
        }

        Logger.log(`Merged duplicate mocks for ${AwsApi}`)
        _.merge(originalObject, pendingObject)
        return true
      }

      Logger.log(`Added mocks for ${AwsApi}`)

      this[AwsApi] = Opts ? Promise.promisifyAll(new MockClass(Opts)) : Promise.promisifyAll(new MockClass())
      return true
    }

    if(this.isAvailable(AwsApi)){
      Logger.warn('Attempted to create an API object that already exists.')
      return false
    }

    Logger.log(`Adding Actual "${AwsApi}" to AWS plugin.`)
    let cls = Classes[AwsApi]
    if(cls){
      this[AwsApi] = Opts ? Promise.promisifyAll(new cls(Opts)) : Promise.promisifyAll(new cls())
      return true
    }

    Logger.error(`An API object with the name ${AwsApi} could not be found.`)
    throw new Error(`${AwsApi} could not be found.`)
  }


  // Populate the Injectable AWS object.
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