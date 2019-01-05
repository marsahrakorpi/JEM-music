import Service from '@ember/service';
import ENV from '../config/environment'
import $ from 'jquery'
import { run } from '@ember/runloop'

export default Service.extend({
    /*https://developer.spotify.com/documentation/general/guides/authorization-guide/#client-credentials-flow*/
/*
*
*Authorization	Required. 
*Base 64 encoded string that contains the client ID and client secret key. The field must have the format: Authorization: Basic <base64 encoded client_id:client_secret>
*
*/

    access_token: null,

    init(){
        this._super(...arguments);

    },

    authenticate(){

        let accessToken = $.ajax({
            url: ENV.jemapiURL+"/SpotifyAuthentication",
            method: "GET",
        })
  
        this.set('access_token', accessToken);
     
    },
    getNewAccessToken(){
        return new Promise(resolve => {
                $.ajax({
                    url: ENV.jemapiURL+"/SpotifyAuthentication",
                    method: "GET",
                }).then(res => {
                    resolve(res);
                });
            }
        );
    },
    getTrackSingle(searchTerm){
        if(!searchTerm ||searchTerm === ""){
            return;
        }
        let accessToken = this.get('access_token').responseText;

        return new Promise(resolve => {
            $.ajax({
            url: "https://api.spotify.com/v1/search?q="+searchTerm+"&type=track&offset=0&limit=20",
            method: "GET",
            headers: {
                "Authorization": "Bearer "+accessToken
            },
            }).then(res =>{
                resolve(res);
            }).catch((err) => {
                if(err.responseJson.error.status === 401){
                    accessToken  = this.getNewAccessToken();
                    $.ajax({
                        url: "https://api.spotify.com/v1/search?q="+searchTerm+"&type=track&offset=0&limit=20",
                        method: "GET",
                        headers: {
                            "Authorization": "Bearer "+accessToken
                        },
                    }).then(res => {
                        run(()=>{
                            this.set('access_token', accessToken);
                            resolve(res)
                        })
                    });
                } else {
                    console.log(err);
                }
            });
        });
    }
});
