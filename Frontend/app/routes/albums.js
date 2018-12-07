import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
export default Route.extend({
    jemapi: service('jemapi'),
    
    model(){
        return this.get('store').peekAll('album');
    }
});
