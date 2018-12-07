import Route from '@ember/routing/route';

import { inject as service } from '@ember/service';

export default Route.extend({
    jemapi: service('jemapi'),
    spotify: service(),
    tracks: null,
    limit: 25,
    page: 1,

    model(){
        this.get('spotify').authenticate();
        return this.get('store').peekAll('track');
    }

});
