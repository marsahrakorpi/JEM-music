import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';
export default Route.extend({
    api: service('api'),
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
        return get(this, 'store').query('album', params);
    }
});
