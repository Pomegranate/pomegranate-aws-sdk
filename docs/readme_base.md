# Pomegranate AWS SDK

Provides promisified AWS APIs made available on the injector param `AWS`.

### Install

``` shell
yarn add pomegranate pomegranate-aws-sdk
# Or..
npm i -S pomegranate pomegranate-aws-sdk
```

## Configuration

This plugin exposes 3 configuration options.

The `awsApis` option accepts an array of AWS service name strings and/or objects that contain a name property
and optionally an options property that will be passed to the service when it is instantiated.
The `awsConfig` option will be passed as-is to `AWS-SDK`.
The `apiVersions` option can be used to specify the version string of the APIs in use.

``` javascript

exports.AwsSdk = function(Env){
  return {
    awsApis: ['S3', {name: 'SNS', options: {maxRetries: 5}}]
  },
  awsConfig: {
  	region: 'us-east-1'
  },
  apiVersions: {
  	s3: '2006-03-01',
  	SNS: '2010-03-31'
  }
}

```

## Usage

The plugin adds an `AWS` property to the Pomegranate dependency injector, this object will contain instantiated,
configured objects with property names corresponding to the services you provided in its config file.

It also exposes a helper method `AWS#isAvailable(string)` for use by downstream plugins who wish to determine if
a plugin is available.

## Available AWS APIs

Please see http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/ sidebar for supported services.

The AWS objects outside of the services Namespace should be considered "Advanced Usage" and treated with caution.

## Detailed Documentation

