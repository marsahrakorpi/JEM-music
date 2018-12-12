import Route from '@ember/routing/route';

import { inject as service } from '@ember/service';

export default Route.extend({
    jemapi: service('jemapi'),

    init(){
        this._super(...arguments);

    },
    model(){
        return this.get('store').peekAll('track');
    },

    actions: {
        refreshModel(){
            this.refresh();
        }
    }
        
    

});
