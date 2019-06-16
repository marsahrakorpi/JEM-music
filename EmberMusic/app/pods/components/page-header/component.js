import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { get, set } from '@ember/object';

export default Component.extend({
    api: service(),
    router: service(),
    session: service(),
    store: service(),
    actions: {
        transitionTo(route) {
            get(this, 'router').transitionTo(route);
        },
        reload() {
            localStorage.removeItem('tracks');
            localStorage.removeItem('albums');
            localStorage.removeItem('artists');
            localStorage.removeItem('genres');
            get(this, 'store').unloadAll();
            get(this, 'api').loadAll();
        },
        showLoginModal() {
            set(this, 'showModal', true);
        },

        closeLoginModal() {
            set(this, 'showModal', false);
        }
    }
});
