/**
 * @file index
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate-Aws-Sdk
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

"use strict";

module.exports = {
  NO_AUTH: 'The AWS SDK plugin requires the "AWS_ACCESS_KEY_ID" and "AWS_SECRET_ACCESS_KEY" Environment variables to be set.',
  NOT_ARRAY: 'The settings property "awsApis" must be an array of AWS API names.',
  NO_NAME: 'An object included in the awsApi setting array must include a name property.',
  NOT_VALID: 'Could not construct an AWS API object from the provided item.',
  NOT_AVAILABLE: item => {return `"${item}" is not available to load as an AWS API.`},
  LOADED: item => {return `"${item}" will be loaded and available at AWS.${item}`}
}