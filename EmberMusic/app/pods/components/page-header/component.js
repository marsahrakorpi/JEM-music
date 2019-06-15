import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
    api: service(),
    router: service(),
    session: service(),
    store: service(),
    actions: {
        transitionTo(route) {
            this.get('router').transitionTo(route);
        },
        reload() {
            localStorage.removeItem('tracks');
            localStorage.removeItem('albums');
            localStorage.removeItem('artists');
            localStorage.removeItem('genres');
            this.get('store').unloadAll();
            this.get('api').loadAll();
        },
        showLoginModal() {
            this.set('showModal', true);
        },

        closeLoginModal() {
            this.set('showModal', false);
        }
    }
});
