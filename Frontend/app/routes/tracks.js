import Route from '@ember/routing/route';

import { inject as service } from '@ember/service';

export default Route.extend({
    jemapi: service('jemapi'),

    init(){
        this._super(...arguments);

    },
    model(){
        let data = this.get('store').peekAll('track');
        console.log(data);
        return data;
    },

    actions: {
        refreshModel(){
            this.refresh();
        }
    }
        
    

});
