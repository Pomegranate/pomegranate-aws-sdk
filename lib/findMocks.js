/**
 * @file findMocks
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate-Aws-Sdk
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const path = require('path')
const _fp = require('lodash/fp')
const PluginUtils = require('magnum-plugin-utils')
const FileBaseName = PluginUtils.fileBaseName
const FileList = PluginUtils.fileList
/**
 * Loads Mock AWS API classes
 * @module findMocks
 */

module.exports = function(WorkDir){
  return FileList(WorkDir, {ext: '.js'})
    .then((files) => {
      return _fp.reduce((obj, file) => {
        obj[FileBaseName(file)] = require(path.join(WorkDir, file))
        return obj
      }, {})(files)
    })
}
