import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
    session: service(),

    user: computed(function(){
       let user = this.get('session.data.authenticated.user.firstname');
       if (user === undefined) {
           user = "Unknown";
       }
       return user;
    }),
    actions:{
        
        logout() {
            this.get('session').invalidate();
        },
        showUserActions(){
            this.set('showUserActions', true);
        },
        hideUserActions(){
            
        }
    }
});
