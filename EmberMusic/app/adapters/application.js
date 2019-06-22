import DS from 'ember-data';
import ENV from '../config/environment';
import TokenAuthorizerMixin from 'ember-simple-auth-token/mixins/token-authorizer';

export default DS.JSONAPIAdapter.extend(TokenAuthorizerMixin, {
    host: ENV.apiURL
});
