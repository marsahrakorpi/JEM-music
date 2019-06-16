import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';

export default Route.extend({
    api: service('api'),
    session: service(),
    init(){
        this._super(...arguments);

    },
    model(){
        return get(this, 'store').peekAll('track');
    },

    actions: {
        refreshModel(){
            this.refresh();
        }
    }
        
    

});
