import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('connect');
  this.route('tracks');
  this.route('albums');
  this.route('artists');
});

export default Router;
