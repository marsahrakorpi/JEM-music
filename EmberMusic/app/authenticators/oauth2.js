import OAuth2PasswordGrantAuthenticator from 'ember-simple-auth/authenticators/oauth2-password-grant';
import ENV from 'EmberMusic/config/environment'
export default OAuth2PasswordGrantAuthenticator.extend({
  serverTokenEndpoint: ENV.apiURL+'/login'
});