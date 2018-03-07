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

//Profile explicitly set

// SharedIniFileCredentials {
//   expired: false,
//     expireTime: null,
//     accessKeyId: 'AKIAIVYZDIWXKSRRXX5Q',
//     sessionToken: undefined,
//     filename: undefined,
//     profile: 'bob',
//     disableAssumeRole: true,
//     preferStaticCredentials: false }

//Instance role, no ~/.aws/credentials default

// EC2MetadataCredentials {
//   expired: false,
//     expireTime: 2018-03-06T23:59:19.000Z,
//     accessKeyId: 'ASIAJEDXHSI36DMK2KKQ',
//     sessionToken: 'FQoDYXdzEHsaDD9x+ZDXMZ4p3RFDwSK3A0ElBCa9/uNAizRRVSM6vrD4yYlk1ALUay7gA6LoipeVI7goufa+walFcsDWwEaB/YjvtVB96oFvx8hIRlAPrGzJv/dN6qf2Qk4ZBC/VStWjPdl/TCP9XgOmCVRhb+I787iWht3XliDWVR8PzbjzR0yR7DG8jwdL4l6/Ryx0fZdQSHgiIMTBRpxs01Zl1NQQ8g9G/U3BJuNfvsxIE9avwM0LZh6VLNS+LMZ2lQ8AXWyRuSaqxtJ0kqszm63joLqnlwVCSLaO0HI+S4eS7jTpMKYK52URM3iB2Dx72LoYRL8Ci65mCZHGyvlEu3jjw7klN+fFQ8N08avj1LVuaQNhU2VARlVGka/DMRzzh6AQHGq01eHG8ec7WfJPsachj3l50jXIUFWOnfFTlHH4fLTqleyCLAWdHW4oazRKBgp1NbJCQl7MOor6wHE/+f3GIZYz4kUCM+UxpI3UuXYFGPJfkkzoJ8Krh347gCN+cDZ513+6QxFZqrKyy9euiLIyWAISCFlhrQrLEddGFC1uEVKLVnyd4RXfNcEo0C8G9o4Xb9lGynXFwrlUiodvffZlnr+ELfHliAlHUY8ojJ/71AU=',
//     metadataService: MetadataService { maxRetries: 3, httpOptions: { timeout: 1000 } },
//   metadata:
//   { Code: 'Success',
//     LastUpdated: '2018-03-06T17:27:40Z',
//     Type: 'AWS-HMAC',
//     AccessKeyId: 'ASIAJEDXHSI36DMK2KKQ',
//     SecretAccessKey: 'bgoWd/ESOtECOLUpUrHgoGB7ZJLP6LyqMmJftoI/',
//     Token: 'FQoDYXdzEHsaDD9x+ZDXMZ4p3RFDwSK3A0ElBCa9/uNAizRRVSM6vrD4yYlk1ALUay7gA6LoipeVI7goufa+walFcsDWwEaB/YjvtVB96oFvx8hIRlAPrGzJv/dN6qf2Qk4ZBC/VStWjPdl/TCP9XgOmCVRhb+I787iWht3XliDWVR8PzbjzR0yR7DG8jwdL4l6/Ryx0fZdQSHgiIMTBRpxs01Zl1NQQ8g9G/U3BJuNfvsxIE9avwM0LZh6VLNS+LMZ2lQ8AXWyRuSaqxtJ0kqszm63joLqnlwVCSLaO0HI+S4eS7jTpMKYK52URM3iB2Dx72LoYRL8Ci65mCZHGyvlEu3jjw7klN+fFQ8N08avj1LVuaQNhU2VARlVGka/DMRzzh6AQHGq01eHG8ec7WfJPsachj3l50jXIUFWOnfFTlHH4fLTqleyCLAWdHW4oazRKBgp1NbJCQl7MOor6wHE/+f3GIZYz4kUCM+UxpI3UuXYFGPJfkkzoJ8Krh347gCN+cDZ513+6QxFZqrKyy9euiLIyWAISCFlhrQrLEddGFC1uEVKLVnyd4RXfNcEo0C8G9o4Xb9lGynXFwrlUiodvffZlnr+ELfHliAlHUY8ojJ/71AU=',
//     Expiration: '2018-03-06T23:59:19Z' } }


//ENV SET KEYS
// EnvironmentCredentials {
//   expired: false,
//     expireTime: null,
//     accessKeyId: 'AKIAIVYZDIWXKSRRXX5Q',
//     sessionToken: undefined,
//     envPrefix: 'AWS' }


// AWS default credentials set
// SharedIniFileCredentials {
//   expired: false,
//     expireTime: null,
//     accessKeyId: 'AKIAIVYZDIWXKSRRXX5Q',
//     sessionToken: undefined,
//     filename: undefined,
//     profile: 'default',
//     disableAssumeRole: true,
//     preferStaticCredentials: false }