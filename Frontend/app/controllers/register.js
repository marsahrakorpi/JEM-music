import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
export default Controller.extend({
    session: service(),
    router: service(),
    jemapi: service(),

    init(){
        this._super(...arguments);
        if(this.get('session').isAuthenticated){
            this.get('router').transitionTo('/');
        }
    },

    actions:{
        register(){
            let email = this.get('identification');
            let password = this.get('password');
            this.get('jemapi').registerNewUser(email, password).then(()=> {
                let { identification, password } = this.getProperties('identification', 'password');
                this.get('session').authenticate('authenticator:oauth2', identification, password).catch((reason) => {
                    this.set('errorMessage', reason);
                })
            })
        },
        cancel(){
            window.history.back(1);
        },

        setEmail(e){
            this.set('identification', e);
        },

        setPassword(p){
            this.set('password', p);
        }
    }
    
});
