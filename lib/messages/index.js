/**
 * @file index
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate-Aws-Sdk
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

"use strict";

module.exports = {
  NO_ENVS: '"AWS_ACCESS_KEY_ID" and "AWS_SECRET_ACCESS_KEY" Environment variables not set, using Instance Role.',
  NO_AUTH: '"AWS_ACCESS_KEY_ID" and "AWS_SECRET_ACCESS_KEY" Environment variables not set, using Instance Role.',
  NOT_ARRAY: 'The settings property "awsApis" must be an array of AWS API names.',
  NO_NAME: 'An object included in the awsApi setting array must include a name property.',
  NOT_VALID: 'Could not construct an AWS API object from the provided item.',
  NO_MOCK: item => `${item} does not have a corresponding mock file available.`,
  NOT_AVAILABLE: item => `"${item}" is not available to load as an AWS API.`,
  LOADED: item => `"${item}" will be loaded and available at AWS.${item}`
}