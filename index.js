const authentication = require('./authentication')
const BodyFat = require('./triggers/bodyFat')
const BodyWeight = require('./triggers/bodyWeight')

const includeBearerToken = (request, z, bundle) => {
  if (request.headers.Authorization && request.headers.Authorization.startsWith('Basic')) {
    return request
  }
  if (bundle.authData.access_token) {
    request.headers.Authorization = `Bearer ${bundle.authData.access_token}`
  }
  return request
}

const App = {
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,

  authentication: authentication,

  beforeRequest: [
    includeBearerToken
  ],

  afterResponse: [
  ],

  resources: {
  },

  triggers: {
    [BodyFat.key]: BodyFat,
    [BodyWeight.key]: BodyWeight
  },

  searches: {
  },

  creates: {
  }
}

module.exports = App
