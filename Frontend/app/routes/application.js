import Route from '@ember/routing/route';
import { inject as service } from '@ember/service'
import $ from 'jquery'
import ENV from '../config/environment'

export default Route.extend({
    jemapi: service(),
    spotify: service(),

    init(){
        this._super(...arguments);
        this.get('spotify').authenticate();
    },
    beforeModel(){

        const store = this.get('store');

        if(localStorage.getItem('tracks') === null) {
            $.ajax({
                url: ENV.jemapiURL+'/tracks',
                method: "GET",
                success: function(res){
                    localStorage.setItem('tracks', JSON.stringify(res));
                    store.pushPayload(res)
                },
                error: function(err){
                  
                }
            });
        } else {
            store.pushPayload(JSON.parse(localStorage.getItem("tracks")))
        }

        if(localStorage.getItem('albums') === null) {
            $.ajax({
                url: ENV.jemapiURL+'/albums',
                method: "GET",
                success: function(res){
                    localStorage.setItem('albums', JSON.stringify(res));
                    store.pushPayload(res)

                },
                error: function(err){

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

                }
            });
        } else {
            store.pushPayload(JSON.parse(localStorage.getItem("genres")))
        }
      }
});
