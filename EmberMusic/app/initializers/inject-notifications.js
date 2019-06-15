export function initialize(application) {
  application.inject('controller', 'notifications', 'service:notification-messages', 'service:session');
}

export default {
  name: 'inject-notifications',
  initialize
};