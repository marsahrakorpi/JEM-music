import Route from '@ember/routing/route';

import { inject as service } from '@ember/service';

export default Route.extend({
    jemapi: service('jemapi'),
    tracks: null,
    limit: 25,
    page: 1,

    model(){
        return this.get('store').peekAll('track');
    }

});
