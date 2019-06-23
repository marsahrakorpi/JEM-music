'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'EmberMusic',
    podModulePrefix: 'EmberMusic/pods',
    environment,
    rootURL: '/',
    locationType: 'hash',
    apiURL: "http://localhost:3000",

    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created

    }
  };


  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
    ENV['ember-simple-auth-token'] = {
      refreshAccessTokens: true,
      refreshLeeway: 60, // refresh 5 minutes (300 seconds) before expiration
      authorizationHeaderName: 'Authorization', // Header name added to each API request
      authorizationPrefix: 'Bearer ', // Prefix added to each API request
      serverTokenEndpoint: ENV.apiURL+'/login', // Server endpoint to send authenticate request
      serverTokenRefreshEndpoint: ENV.apiURL+'/login?refresh=true',
      tokenPropertyName: 'access_token', // Key in server response that contains the access token

    };
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
    ENV['ember-simple-auth-token'] = {
      refreshAccessTokens: false,
      tokenExpirationInvalidateSession: false,
    };
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
    ENV.apiURL = "https://jemapi.herokuapp.com"
    ENV['ember-simple-auth-token'] = {
      refreshAccessTokens: true,
      refreshLeeway: 60, // refresh 5 minutes (300 seconds) before expiration
      authorizationHeaderName: 'Authorization', // Header name added to each API request
      authorizationPrefix: 'Bearer ', // Prefix added to each API request
      serverTokenEndpoint: ENV.apiURL+'/login', // Server endpoint to send authenticate request
      tokenPropertyName: 'access_token', // Key in server response that contains the access token

    };
  }

  return ENV;
};
