import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';
import $ from 'jquery'
import ENV from '../config/environment'

export default Service.extend({
    store: service(),
    notifications: service('notification-messages'),
    
    url: ENV.apiURL,

    init(){
        this._super(...arguments);

    },

    loadAll(){
        const store = this.get('store');
        $.ajax({
            url: ENV.apiURL+'/getAll',
            method: "GET",
            success: function(res){
                res.forEach(r => {
                    store.pushPayload(r);
                })
            },
            error: function(err){
                throw new Error(err)
            }
        });
    },

    saveRecord(record){

        record.save().then(() => {
            this.get('notifications').success("Record saved succesfully", {
                autoClear: true,
                clearDuration: 2000
            });
        }).catch((e) => {
            throw new Error(e)
            this.get('notifications').error("Record was not saved!", {
                autoClear: true,
                clearDuration: 2000
            });
        });         

    },

    deleteRecord(record){

        record.destroyRecord().then(()=>{
            this.get('notifications').success("Record removed succesfully", {
                autoClear: true,
                clearDuration: 2000
            });
        }).catch(e => {
            throw new Error(e)
            this.get('notifications').error("Record was not removed!", {
                autoClear: true,
                clearDuration: 2000
            });
        });    

    },

    validateEmail(email){
        //w{2,4} allows 2 to 4 letter domain like .info
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(email)){
            return true;
        }
        else {
            return false;
        }
    },
    registerNewUser(email, password) {

        return new Promise((resolve)=>{
            $.ajax({
                url: ENV.apiURL+'/register',
                method: "POST",
                data: {
                    "email": email,
                    "password": password
                },
                success: function(){
                    resolve();
                },
                error: function(err){
                    throw new Error(err)
                }
            });
        });


    }
});
