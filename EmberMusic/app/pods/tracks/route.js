import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';

export default Route.extend({
    api: service('api'),
    session: service(),

    queryParams: {
        limit: {
            refreshModel: true
        },
        order: {
            refreshModel: true
        },
        sort: {
            refreshModel: true
        },
        direction: {
            refreshModel: true
        }
    },

    model(params){
        return get(this, 'store').query('track', params);
    },

    actions: {
        refreshModel(){
            this.refresh();
        }
    }
        
    

});
