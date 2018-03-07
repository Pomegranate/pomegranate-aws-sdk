/**
 * @project Pomegranate-Aws-Sdk
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';

const findMocks = require('./lib/findMocks')
const findActual = require('./lib/findActual')
const configActual = require('./lib/configActual')
const loader = require('./lib/loader')
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
  workDir: 'aws-sdk-mocks',
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
  useMocks: false
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
    let LoadedAwsApis
    if(this.options.useMocks){

      this.Logger.warn('Using Mock AWS objects.')
      LoadedAwsApis = findMocks(this.options.workDir)

    } else {
      this.Logger.log('Using actual AWS API objects, charges may be incurred.')
      LoadedAwsApis = findActual({Env, Logger: this.Logger})
        .then((AWS) => {
          return configActual({
            AWS,
            options: this.options,
            Logger: this.Logger
          })
        })

    }

    LoadedAwsApis
      .then((Classes) => {

        return loader({Classes, APIs: this.options.awsApis, Logger: this.Logger})
      })
      .then((loadObj) => {
        loaded(null, loadObj)
      })
      .catch((err) => {
        this.Logger.error(err.message)
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