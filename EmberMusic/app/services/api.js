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
        const store = get(this, 'store');
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
            get(this, 'notifications').success("Record saved succesfully", {
                autoClear: true,
                clearDuration: 2000
            });
        }).catch((e) => {
            get(this, 'notifications').error("Record was not saved!", {
                autoClear: true,
                clearDuration: 2000
            });
            throw new Error(e)
        });         

    },

    deleteRecord(record){

        record.destroyRecord().then(()=>{
            get(this, 'notifications').success("Record removed succesfully", {
                autoClear: true,
                clearDuration: 2000
            });
        }).catch(e => {
            get(this, 'notifications').error("Record was not removed!", {
                autoClear: true,
                clearDuration: 2000
            });
            throw new Error(e)
        });    

    },

    validateEmail(email){
        //w{2,4} allows 2 to 4 letter domain like .info
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(email)){ //eslint-disable-line no-useless-escape
            return true;
        }
        else {
            return false;
        }
    },
    registerNewUser(email, password, firstname, lastname) {

        if(!email || !password || !firstname || !lastname) throw new Error("missing param for registering user")

        let data = {
            email:email,
            password:password,
            firstname:firstname,
            lastname:lastname
        }
        return new Promise((resolve)=>{
            $.ajax({
                url: ENV.apiURL+'/register',
                method: "POST",
                type: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(data),
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
