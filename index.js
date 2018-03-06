/**
 * @project Pomegranate-Aws-Sdk
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';

const AWS = require('aws-sdk')
const Promise = require('bluebird')
const _ = require('lodash')
const msg = require('./lib/messages')
const validation = require('./lib/validation')

/**
 * A configurable loader for AWS-SDK
 * @module pomegranate-aws-sdk
 */

/**
 * @type options
 *
 * @property {array.<string|{name: string, options: object}>} awsApis - AWS Services that will be loaded into the base AWS injectable object.
 * Can be either a string of the name of the AWS service, or an object with name and options parameters.
 * @property {object} awsConfig - Global AWS configuration that will be provided to aws-sdk before any services are instantiated.
 * @property {object} apiVersions - Api versions this plugin will use, also loaded before any services are instantiated.
 * @property {boolean} useMocks - Load mock AWS objects instead.
 * @property {string} mockFile - Path to mock objects file.
 */
exports.options = {
  awsApis: [
    'S3',
    {name: 'CloudWatchLogs', options: {}}
  ],
  awsConfig: {
    region: 'us-east-1'
  },
  apiVersions: {
    S3: '2006-03-01'
  },
  useMocks: false,
  mockObjects: {
    S3: './some/path'
  }
}

/**
 *
 * @type metadata
 * @property {string} name - AwsSDK: Module Internal name used by its logger.
 * @property {string} type - service: Is a service type plugin.
 * @property {string} param - AWS: Available on the injector as AWS.
 */

exports.metadata = {
  name: 'AwsSDK',
  type: 'service',
  param: 'AWS',
}

/**
 *
 * @type plugin
 */
exports.plugin = {
  /**
   * Load Hook - Builds the awsApis object and adds it to the injector.
   * @returns {awsApis} - Adds awsApis to the injector as "AWS"
   */
  load: function(inject, loaded){
    let Env = inject('Env')

    let authCheck = () => Promise.resolve(true)

    if(validation.noAuthKeys(Env)){
      // let e = new Error(msg.NO_AUTH)
      this.Logger.warn(msg.NO_ENVS)
      let ecMeta = new AWS.EC2MetadataCredentials()

      authCheck = () => ecMeta.getPromise()
      // return loaded(e)
    }

    authCheck()
      .then(() => {
        if(!_.isArray(this.options.awsApis)){
          let e = new Error(msg.NOT_ARRAY)
          return loaded(e)
        }

        if(!this.options.awsApis.length){
          this.Logger.warn('No AWS APIS are configured to load via this plugins settings.')
          this.Logger.warn('Add needed AWS APIs to the setting "AwsApis" in the settings file.')
        }

        if(_.isObject(this.options.awsConfig)){
          this.Logger.log('Updating AWS configuration with provided values.')
          AWS.config.update(this.options.awsConfig)
        }

        if(_.isObject(this.options.apiVersions)){
          this.Logger.log('Updating AWS api versions with provided values.')
          AWS.config.apiVersions = this.options.apiVersions
        }

        /**
         * The Main object created by this plugin, containing all of the configured AWS service instances
         * available for use by any downstream plugin.
         * @type {awsApis} AwsApis
         * @property {function} isAvailable
         * @property {object} AWS_Service_Name - A dynamic property storing the configured AWS API instance.
         * there will be one for every service listed in the options.awsApis array setting.
         */
        let awsApis = {}

        /**
         * Allows downstream plugins to determine if an AWS API is available.
         * @param serviceString - The name of the AWS API you wish to find the status of.
         * @returns {boolean}
         */
        awsApis.isAvailable = function(serviceString){
          return _.isObject(this[serviceString])
        }

        _.each(this.options.awsApis, (item)=>{

          let name
          let opts = null
          let potentialAwsApi

          if(_.isObject(item)){
            if(!_.has(item, 'name')){
              this.Logger.warn(msg.NO_NAME)
              return
            }

            name = item.name
            if(_.has(item, 'options')){
              opts = item.options
            }
          }
          else if(_.isString(item)){
            name = item
          }
          else {
            this.Logger.warn(msg.NOT_VALID)
            return
          }

          potentialAwsApi = AWS[name]
          if(!_.isObject(potentialAwsApi)){
            this.Logger.warn(msg.NOT_AVAILABLE(item))
            return
          }

          this.Logger.log(msg.LOADED(name))

          if(this.options.useMocks){
            // Use provided mock classes.
            let mock = this.options.mockObjects[name]
            if(!mock){throw new Error(msg.NO_MOCK(name))}
            let cls = require(mock)
            awsApis[name] = opts ? Promise.promisifyAll(new cls(opts)) : Promise.promisifyAll(new cls())
          } else {
            awsApis[name] = opts ? Promise.promisifyAll(new potentialAwsApi(opts)) : Promise.promisifyAll(new potentialAwsApi())
          }
        })

        loaded(null, awsApis)
      })
      .catch((err) => {
        loaded(err)
      })


  },
  /**
   * Start Hook - Not Used.
   */
  start: function(done){
    done()
  },
  /**
   * Stop Hook - Not Used.
   */
  stop: function(done){
    done()
  }
}