import JWTPasswordGrantAuthenticator from 'ember-simple-auth/authenticators/oauth2-password-grant';
import ENV from 'EmberMusic/config/environment';
export default JWTPasswordGrantAuthenticator.extend({
    serverTokenEndpoint: ENV.apiURL+'/login'
});