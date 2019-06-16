import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { get, set, computed } from '@ember/object';

export default Component.extend({

    session: service(),

    authenticated: computed('session.data.authenticated.user',function() {
        if(get(this,'session.data.authenticated.user')) return true;
        else return false;
    }),

    actions: {
        showModal(modal){
            console.log(modal);
            set(this, 'modal', 'admin-actions/'+modal);
        },

        closeModal(){
            set(this, 'modal', null)
        }
    }

});
