import Route from '@ember/routing/route';
import { inject as service } from '@ember/service'

export default Route.extend({
    jemapi: service(),
    spotify: service(),

    init(){
        this._super(...arguments);
        this.get('spotify').authenticate();
    },
    beforeModel(){

        this.get('jemapi').loadAll();

    }

});
