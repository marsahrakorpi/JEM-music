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
        page: {
            refreshModel: true
        }
    },

    model(params){
        console.log(params);

        return get(this, 'store').query('track', params, {include: 'artist'});
    },

    actions: {
        refreshModel(){
            this.refresh();
        }
    }
        
    

});
