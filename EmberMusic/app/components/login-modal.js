import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { get, set } from '@ember/object';

export default Component.extend({
    session: service(),
    router: service(),

    actions: {
        authenticate() {
            let { identification, password } = this.getProperties('identification', 'password');
            get(this, 'session').authenticate('authenticator:oauth2', identification, password).catch((reason) => {
                set(this, 'errorMessage', reason);
            }).then(()=>{
                set(this, 'showModal', false);
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
