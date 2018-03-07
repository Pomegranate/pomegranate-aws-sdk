/**
 * @file index
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate-Aws-Sdk
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

"use strict";

module.exports = {
  NO_ENVS: '"AWS_ACCESS_KEY_ID" and "AWS_SECRET_ACCESS_KEY" Environment variables not set.',
  NO_ROLE: 'Unable to fetch instance role credentials! \nIf this plugin is running on AWS either set credential ENV vars, or make sure your instance can connect to the EC2 metadata service. ',
  NO_PROFILE: '"AWS_PROFILE" not set, will use "default" if present.',
  NOT_ARRAY: 'The settings property "awsApis" must be an array of AWS API names.',
  NO_NAME: 'An object included in the awsApi setting array must include a name property.',
  NOT_VALID: 'Could not construct an AWS API object from the provided item.',
  USING_META: 'Using IAM Instance role.',
  USING_ENV: 'Using IAM role set from enviroment variables.',
  WARN_NO_SYNC: `
  Syncronous Credentials not found, attempting EC2MetadataCredentials.
  This plugin may timeout if an instance role is not available or configured properly.
  If this issue persists and you believe your configuration is correct, please raise the timeout value in Pomegranate.`,
  USING_FILE: profile => `Using profile "${profile}" from AWS credentials file.`,
  NO_MOCK: item => `${item} does not have a corresponding mock file available.`,
  NOT_AVAILABLE: item => `"${item}" is not available to load as an AWS API.`,
  LOADED: item => `"${item}" will be loaded and available at AWS.${item}`
}