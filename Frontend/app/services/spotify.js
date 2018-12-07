import Service from '@ember/service';
import ENV from '../config/environment'
import $ from 'jquery'
import RSVP, { resolve } from 'rsvp';
export default Service.extend({
    /*https://developer.spotify.com/documentation/general/guides/authorization-guide/#client-credentials-flow*/
/*
*
*Authorization	Required. 
*Base 64 encoded string that contains the client ID and client secret key. The field must have the format: Authorization: Basic <base64 encoded client_id:client_secret>
*
*/
    client_credentials: ENV.spotify_ClientId+":"+ENV.spotify_ClientSecret,

    client_id : ENV.spotify_ClientId, // Your client id
    client_secret :ENV.spotify_ClientSecret, // Your secret
    access_token: null,

    init(){
        this._super(...arguments);

    },

    authenticate(){
        let cred = this.get('client_credentials');
        console.log(cred);
        let accessToken = $.ajax({
            url: ENV.jemapiURL+"/SpotifyAuthentication",
            method: "GET",
        })
  
        this.set('access_token', accessToken);
    
   
        
    },

    getTrackSingle(searchTerm){

        let accessToken = this.get('access_token').responseText;

        return $.ajax({
            url: "https://api.spotify.com/v1/search?q="+searchTerm+"&type=track&offset=0&limit=1",
            method: "GET",
            headers: {
                "Authorization": "Bearer "+accessToken
            },
            success: function(res){
                return res;
            },
            async:false,
        }).responseJSON;

    }
});
