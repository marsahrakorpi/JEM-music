import Route from '@ember/routing/route';

export default Route.extend({

    actions: {
        transitionTo(route) {
            this.transitionTo(route);
        }
    }
});
