import Component from '@ember/component';
import { inject as service } from '@ember/service'
import { get, set } from '@ember/object';

export default Component.extend({
    api: service(),
    store: service(),
    init(){
        this._super(...arguments);

        set(this, 'id', get(this, 'record.id'));

    },

    actions:{
        showModal(){
            set(this, 'showModal', true);
        },
        close(){
            set(this, 'showModal', false)
        },

        submit(){
            let id = get(this, 'id');

            let track = get(this, 'store').peekRecord('track', id, {backgroundReload: false})

            get(this, 'api').deleteRecord(track);

            set(this, 'showModal', false);
        }
    
    }


});
