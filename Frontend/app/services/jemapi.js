import Service from '@ember/service';
import { inject as service } from '@ember/service'
import $ from 'jquery'
import ENV from '../config/environment'

export default Service.extend({
    store: service(),

    track: null,
    loading: false,
    url: ENV.jemapiURL,

    init(){
        this._super(...arguments);

    },

    loadAll(){
        const store = this.get('store');
        
        if(localStorage.getItem('tracks') === null) {
            
            //me.controllerFor('tracks').set('loading',true);
            $.ajax({
                url: ENV.jemapiURL+'/tracks',
                method: "GET",
                success: function(res){
                    localStorage.setItem('tracks', JSON.stringify(res));
                    store.pushPayload(res)
                    //me.controllerFor('tracks').set('loading', false);
                },
                error: function(err){
                    //me.controllerFor('tracks').set('loading', false);
                    //me.controllerFor('tracks').set('error', true);
                }
            });
        } else {
            store.pushPayload(JSON.parse(localStorage.getItem("tracks")))
        }

        if(localStorage.getItem('albums') === null) {
            this.set('albumsLoading', true);
           // this.controllerFor('albums').loading = true;
            $.ajax({
                url: ENV.jemapiURL+'/albums',
                method: "GET",
                success: function(res){
                    localStorage.setItem('albums', JSON.stringify(res));
                    store.pushPayload(res);
                    //me.controllerFor('albums').set('loading', false);
                },
                error: function(err){
                    //me.controllerFor('albums').set('loading', false);
                    this.set('error', err);
                }
            });
        } else {
            store.pushPayload(JSON.parse(localStorage.getItem("albums")))
        }

        if(localStorage.getItem('artists') === null) {
            $.ajax({
                url: ENV.jemapiURL+'/artists',
                method: "GET",
                success: function(res){
                    localStorage.setItem('artists', JSON.stringify(res));
                    store.pushPayload(res)
                },
                error: function(err){
                    //me.controllerFor('artists').set('loading', false);
                    //me.controllerFor('artists').set('error', true);
                }
            });
        } else {
            store.pushPayload(JSON.parse(localStorage.getItem("artists")))
        }

        if(localStorage.getItem('genres') === null) {
            $.ajax({
                url: ENV.jemapiURL+'/genres',
                method: "GET",
                success: function(res){
                    localStorage.setItem('genres', JSON.stringify(res));
                    store.pushPayload(res)
                },
                error: function(err){
                   // me.controllerFor('genres').set('loading', false);
                   // me.controllerFor('genres').set('error', true);
                }
            });
        } else {
            store.pushPayload(JSON.parse(localStorage.getItem("genres")))
        }

        this.set('loading', true)
    }
});
