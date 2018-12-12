import Component from '@ember/component';
import { inject as service } from '@ember/service'
export default Component.extend({
    jemapi: service(),
    store: service(),
    init(){
        this._super(...arguments);

        this.set('id', this.get('record.id'));

    },

    actions:{
        showModal(){
            this.set('showModal', true);
        },
        close(){
            this.set('showModal', false)
        },

        submit(){
            let id = this.get('id');

            let track = this.get('store').peekRecord('track', id, {backgroundReload: false})

            this.get('jemapi').deleteRecord(track);

            this.set('showModal', false);
        }
    
    }


});
