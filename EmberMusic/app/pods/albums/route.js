import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
export default Route.extend({
    api: service('api'),


    model(){

        return this.get('store').peekAll('album');

    }
});
