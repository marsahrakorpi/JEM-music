import Service from '@ember/service';
import { inject as service } from '@ember/service'
import $ from 'jquery'
import ENV from '../config/environment'
import { resolve, reject } from 'rsvp';

export default Service.extend({
    store: service(),
    notifications: service('notification-messages'),
    track: null,
    loading: false,
    url: ENV.jemapiURL,

    init(){
        this._super(...arguments);

    },

    loadAll(){
        const store = this.get('store');
            
        //me.controllerFor('tracks').set('loading',true);
        $.ajax({
            url: ENV.jemapiURL+'/tracks',
            method: "GET",
            success: function(res){
            // localStorage.setItem('tracks', JSON.stringify(res));
                store.pushPayload(res)
                //me.controllerFor('tracks').set('loading', false);
            },
            error: function(err){
                //me.controllerFor('tracks').set('loading', false);
                //me.controllerFor('tracks').set('error', true);
            }
        });

        this.set('albumsLoading', true);
    // this.controllerFor('albums').loading = true;
        $.ajax({
            url: ENV.jemapiURL+'/albums',
            method: "GET",
            success: function(res){
            // localStorage.setItem('albums', JSON.stringify(res));
                console.log(res);
                store.pushPayload(res);
                //me.controllerFor('albums').set('loading', false);
            },
            error: function(err){
                //me.controllerFor('albums').set('loading', false);
                this.set('error', err);
            }
        });

        $.ajax({
            url: ENV.jemapiURL+'/artists',
            method: "GET",
            success: function(res){
                //7localStorage.setItem('artists', JSON.stringify(res));
                store.pushPayload(res)
            },
            error: function(err){
                //me.controllerFor('artists').set('loading', false);
                //me.controllerFor('artists').set('error', true);
            }
        });
    

        $.ajax({
            url: ENV.jemapiURL+'/genres',
            method: "GET",
            success: function(res){
                //localStorage.setItem('genres', JSON.stringify(res));
                store.pushPayload(res)
            },
            error: function(err){
            // me.controllerFor('genres').set('loading', false);
            // me.controllerFor('genres').set('error', true);
            }
        });
        
        this.set('loading', false)
    },

    save(record){
        console.log("in save")
        
        record.save().then(() => {
            this.get('notifications').success("Record saved succesfully", {
                autoClear: true,
                clearDuration: 2000
            });
        }).catch(() => {
            this.get('notifications').error("Record could was not saved!", {
                autoClear: true,
                clearDuration: 2000
            });
        });         

    }
});
