import Component from '@ember/component';
import { inject as service } from '@ember/service';
export default Component.extend({
    session: service(),
    router: service(),

    actions: {
        authenticate() {
            let { identification, password } = this.getProperties('identification', 'password');
            this.get('session').authenticate('authenticator:oauth2', identification, password).catch((reason) => {
                this.set('errorMessage', reason);
            }).then(()=>{
                this.set('showModal', false);
            })
        },
        closeLoginModal() {
            this.set('showModal', false);
        },
        registerNew(){
            this.set('showModal', false);
            this.get('router').transitionTo('/register');
        }
    }
});
