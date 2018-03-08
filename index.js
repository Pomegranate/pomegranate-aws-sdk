/**
 * @file index.js
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate-Aws-Sdk
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
'use strict';

const findMocks = require('./lib/findMocks')
const findActual = require('./lib/findActual')
const configActual = require('./lib/configActual')
const loader = require('./lib/loader')


/**
 * A configurable loader for the Javascript AWS-SDK
 * Returns an object available as "AWS" containing the configured AWS-SDK objects, as well as helper
 * functions.
 * @module pomegranate-aws-sdk
 * @returns {awsApis}
 */


module.exports = {

  /**
   * configureable options for this Plugin.
   * @property {string} workDir - Working directory containing AWS mock object files.
   * @property {array.<string|{name: string, options: object}>} awsApis - AWS Services that will be loaded into the base AWS injectable object.
   * Can be either a string of the name of the AWS service, or an object with name and options parameters.
   * @property {object} awsConfig - Global AWS configuration that will be provided to aws-sdk before any services are instantiated.
   * @property {object} apiVersions - Api versions this plugin will use, also loaded before any services are instantiated.
   * @property {boolean} useMocks - Load mock AWS objects instead.
   */
  options: {
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
  },

  /**
   * Pomegranate Metadata
   * @property {string} name - AwsSDK - Downstream dependencies can use this name in depends array.
   * @property {string} type - service - This plugin returns a single object.
   * @property {string} param - AWS - Injector parameter name.
   */
  metadata: {
    name: 'AwsSDK',
    type: 'service',
    param: 'AWS',
  },

  plugin: {
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
          return loader({Classes, APIs: this.options.awsApis, Logger: this.Logger, usingMocks: this.options.useMocks})
        })
        .then((loadObj) => {
          loaded(null, loadObj)
        })
        .catch((err) => {
          this.Logger.error(err.message)
          loaded(err)
        })
    },

    start: function(done){
      done()
    },

    stop: function(done){
      done()
    }
  }
}



