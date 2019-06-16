import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { get, set } from '@ember/object';

export default Component.extend({
    session: service(),
    router: service(),
    api: service(),

    init(){
        this._super(...arguments);
        if(get(this, 'session').isAuthenticated){
            get(this, 'router').transitionTo('/');
        }
    },

    actions:{
        register(){
            let email = get(this, 'identification');
            let password = get(this, 'password');

            let firstname = get(this, 'firstname');
            let lastname = get(this, 'lastname');

            get(this, 'api').registerNewUser(email, password, firstname, lastname).then(()=> {
                let { identification, password } = this.getProperties('identification', 'password');
                get(this, 'session').authenticate('authenticator:oauth2', identification, password)
                .then(()=> {
                    get(this, 'router').transitionTo('/');
                })
                .catch((reason) => {
                    set(this, 'errorMessage', reason);
                })
            })
        },
        cancel(){
            window.history.back(1);
        },

        setEmail(e){
            set(this, 'identification', e);
        },

        setPassword(p){
            set(this, 'password', p);
        },

        setFirstname(f){
            set(this, 'firstname', f);
        },

        setLastname(l){
            set(this, 'lastname', l);
        }
    }
    
});
