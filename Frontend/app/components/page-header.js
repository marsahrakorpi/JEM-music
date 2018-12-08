import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
    jemapi: service(),
    router: service(),
    store: service(),
    actions:{
        transitionTo(route){
            this.get('router').transitionTo(route);
        },
        reload(){
            console.log("reload");
            localStorage.removeItem('tracks');
            localStorage.removeItem('albums');
            localStorage.removeItem('artists');
            localStorage.removeItem('genres');
            this.get('store').unloadAll();
            this.get('jemapi').loadAll();
        }
    }
});
