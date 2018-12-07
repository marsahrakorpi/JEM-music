import Route from '@ember/routing/route';
import { inject as service } from '@ember/service'
import $ from 'jquery'
import ENV from '../config/environment'

export default Route.extend({
    jemapi: service(),

    
    beforeModel(){

        const store = this.get('store');

        $.ajax({
            url: ENV.jemapiURL+'/tracks',
            method: "GET",
            success: function(res){
              store.pushPayload(res)
            },
            error: function(err){
              
            }
        });

        $.ajax({
            url: ENV.jemapiURL+'/albums',
            method: "GET",
            success: function(res){
              store.pushPayload(res);
            },
            error: function(err){

            }
        });


        $.ajax({
            url: ENV.jemapiURL+'/artists',
            method: "GET",
            success: function(res){
              store.pushPayload((JSON.parse(res)));
            },
            error: function(err){
                
            }
        });

        $.ajax({
            url: ENV.jemapiURL+'/genres',
            method: "GET",
            success: function(res){
              store.pushPayload((JSON.parse(res)));
            },
            error: function(err){
                console.log(err)
            }
        });
      }
});
