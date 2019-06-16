import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { get, set, computed } from '@ember/object';

export default Component.extend({
    session: service(),

    user: computed(function(){
       let user = get(this, 'session.data.authenticated.user.firstname');
       if (user === undefined) {
           user = "Unknown";
       }
       return user;
    }),
    actions:{
        
        logout() {
            get(this, 'session').invalidate();
        },
        showUserActions(){
            set(this, 'showUserActions', true);
        },
        hideUserActions(){
            
        }
    }
});
