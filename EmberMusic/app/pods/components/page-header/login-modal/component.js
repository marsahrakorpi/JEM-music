import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { get, set } from '@ember/object';

export default Component.extend({
    session: service(),
    router: service(),

    actions: {
        authenticate() {
            
            let credentials = this.getProperties('username', 'password');

            get(this, 'session').authenticate('authenticator:jwt', credentials).catch((reason) => {
                console.log(reason);
                set(this, 'errorMessage', reason.error || reason);
            }).then((e)=>{
                console.log(e)
                set(this, 'showModal', false);
                //window.location.reload();
            })
        },
        closeLoginModal() {
            set(this, 'showModal', false);
        },
        registerNew(){
            set(this, 'showModal', false);
            get(this, 'router').transitionTo('/register');
        }
    }
});
