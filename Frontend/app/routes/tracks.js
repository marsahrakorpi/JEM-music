import Route from '@ember/routing/route';
import { get, set } from '@ember/object'
export default Route.extend({

    track: null,
    limit: 25,
    columns:"id",
    page: 1,

    model(){
        return this.get('store').query('track', {limit:get(this, 'limit'), sideload: true})
    }


});
