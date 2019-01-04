import Service from '@ember/service';
import { inject as service } from '@ember/service'
import $ from 'jquery'
import ENV from '../config/environment'


export default Service.extend({
    store: service(),
    notifications: service('notification-messages'),
    
    url: ENV.jemapiURL,

    init(){
        this._super(...arguments);

    },

    loadAll(){
        const store = this.get('store');

        $.ajax({
            url: ENV.jemapiURL+'/getAll',
            method: "GET",
            success: function(res){
                store.pushPayload(JSON.parse(res))
            },
            error: function(err){
                console.log(err)// eslint-disable-line no-console
            }
        });


    },

    saveRecord(record){

        record.save().then(() => {
            this.get('notifications').success("Record saved succesfully", {
                autoClear: true,
                clearDuration: 2000
            });
        }).catch(() => {
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
            console.log(e)// eslint-disable-line no-console
            this.get('notifications').error("Record was not removed!", {
                autoClear: true,
                clearDuration: 2000
            });
        });    

    }
});
