var config = require('../configCommon')
var serverHostname = config.serverHostname
var fireBaseUri = config.fireBaseUri

if (TEST || DEV) {
  fireBaseUri = config.fireBaseTestingUri
  serverHostname = config.devServerHostname
}

// stripePublishableKey from webpack global.
config.stripePublishableKey = stripePublishableKey
config.serverHostname = serverHostname
config.fireBaseUri = fireBaseUri
module.exports = config
