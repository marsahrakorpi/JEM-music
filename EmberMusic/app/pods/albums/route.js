import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';
export default Route.extend({
    api: service('api'),


    model(){

        return get(this, 'store').peekAll('album');

    }
});
