# Pomegranate AWS SDK

Provides promisified AWS APIs made available on the injector param `AWS`.

### Install

``` shell
yarn add pomegranate pomegranate-aws-sdk
# Or..
npm i -S pomegranate pomegranate-aws-sdk
```

## Options

This plugin accepts an array of AWS api's you wish to load. The setting `awsConfig` will be passed as-is to `AWS-SDK`. The setting `apiVersions` can be used to specify the version string of the APIs in use.

``` javascript

exports.AwsSdk = function(Env){
  return {
    awsApis: ['S3', 'SNS', 'Bob']
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

## Available AWS APIs

Please see http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/ sidebar for supported services.

The AWS objects outside of the services Namespace should be considered "Advanced Usage" and treated with caution.