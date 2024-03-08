# azure-functions-dockerized

This repo is a playground for Azure functions related topics. So far we have explored those issues :

### Create a docker to run the Function App from

See [Dockerfile](Dockerfile). Background is deployment to Azure via Docker instead of using a zip archive in the
pipelines. https://learn.microsoft.com/en-us/azure/azure-functions/deployment-zip-push
https://learn.microsoft.com/en-us/azure/azure-functions/functions-how-to-custom-container?tabs=core-tools%2Cacr%2Cazure-cli2%2Cazure-cli&pivots=azure-functions

### Upload and download data to a blob storage in Azure

Little experimentation on upload and download to and from a
[storage account](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-overview) on Azure. Testing the
`form-data` format with Azure functions: not a success...

### Several APIs in the same repo.

Let's imagine we have a same code base that would implement different endpoints with different purposes. It would be
better to separate concerns but still keep the core functionalities to be duplicated if we, for example, split the
repos. We are here looking into splitting several "APIs" while using Azure functions both times and the same repo.

## To run this repo

To run this repo, make sure you have installed globally [Azurite](https://www.npmjs.com/package/azurite).

Make sure to use Node18 and
[Azure functions v4](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-http-webhook-trigger?tabs=python-v2%2Cisolated-process%2Cnodejs-v4%2Cfunctionsv2&pivots=programming-language-javascript).

## Installation

```bash
$ npm install
```

## Running the app

```bash
$ npm run start
```
