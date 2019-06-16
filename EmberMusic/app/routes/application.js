import Route from '@ember/routing/route';
import { inject as service } from '@ember/service'
import { get } from '@ember/object';

export default Route.extend({
    api: service(),
    spotify: service(),

    init(){
        this._super(...arguments);
        get(this, 'spotify').authenticate();
    },
    beforeModel(){

        get(this, 'api').loadAll();

    }

});
