import Service from '@ember/service';
import { inject as service } from '@ember/service'
import $ from 'jquery'
import ENV from '../config/environment'

export default Service.extend({
    store: service(),

    track: null,

    url: ENV.jemapiURL,

    init(){
        this._super(...arguments);

    },

});
