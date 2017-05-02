/**
 * @file index
 * @author Jim Bulkowski <jim.b@paperelectron.com>
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
 * Pomegranate AWS SDK
 * @module index
 */

exports.options = {
  awsApis: [
    'S3'
  ],
  awsConfig: {
    region: 'us-east-1'
  },
  apiVersions: {
    S3: '2006-03-01'
  }
}

exports.metadata = {
  name: 'AwsSDK',
  type: 'service',
  param: 'AWS',
}

exports.plugin = {
  load: function(inject, loaded){
    let Env = inject('Env')

    if(validation.noAuthKeys(Env)){
      let e = new Error(msg.NO_AUTH)
      return loaded(e)
    }

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

    let awsApis = {}

    /*
     * Utilities for downstream plugins to interface with.
     */
    awsApis.isAvailable = function(serviceString){
      return _.isObject(this[serviceString])
    }

    _.each(this.options.awsApis, (item)=>{
      let potentialAwsApi = AWS[item]
      if(!_.isObject(potentialAwsApi)){
        this.Logger.warn(`"${item}" is not available to load as an AWS API.`)
        return
      }
      this.Logger.log(`"${item}" will be loaded and available at AWS.${item}`)
      awsApis[item] = Promise.promisifyAll(new potentialAwsApi())
    })

    loaded(null, awsApis)
  },
  start: function(done){
    done()
  },
  stop: function(done){
    done()
  }
}