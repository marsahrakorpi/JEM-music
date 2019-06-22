import Service from '@ember/service';
import ENV from '../config/environment'
import $ from 'jquery'
import { run } from '@ember/runloop'
import { get, set } from '@ember/object';
import { reject } from 'rsvp';
export default Service.extend({
    /*https://developer.spotify.com/documentation/general/guides/authorization-guide/#client-credentials-flow*/
/*
*
*Authorization	Required. 
*Base 64 encoded string that contains the client ID and client secret key. The field must have the format: Authorization: Basic <base64 encoded client_id:client_secret>
*
*/

    access_token: null,

    authenticate(){

        let accessToken = $.ajax({
            url: ENV.apiURL+"/spotifyAuthentication",
            method: "GET",
        })
  
        set(this, 'access_token', accessToken);
     
    },
    getNewAccessToken(){
        return new Promise(resolve => {
                $.ajax({
                    url: ENV.apiURL+"/spotifyAuthentication",
                    method: "GET",
                }).then(res => {
                    resolve(res);
                });
            }
        );
    },
    getTrackSingle(searchTerm){
        if(searchTerm === null || searchTerm === undefined || searchTerm === ""){
            return;
        }
        let queryString = searchTerm+"&type=track&offset=0&limit=20";
        let accessToken = get(this, 'access_token').responseText;
        return new Promise((resolve, reject) => {
            $.ajax({
                url: "https://api.spotify.com/v1/search?q="+queryString,
                method: "GET",
                headers: {
                    "Authorization": "Bearer "+accessToken
                },
                success: (res => {
                    resolve(res);
                }),
                error: (err => {
                    if(err.responseJSON.error.status === 401){
                        accessToken  = this.getNewAccessToken();
                        $.ajax({
                            url: "https://api.spotify.com/v1/search?q="+searchTerm+"&type=track&offset=0&limit=20",
                            method: "GET",
                            headers: {
                                "Authorization": "Bearer "+accessToken
                            },
                        }).then(res => {
                            run(()=>{
                                set(this, 'access_token', accessToken);
                                resolve(res)
                            })
                        })
                    } else {
                        reject(err.responseJSON.error.message)
                    }
                })
            });
        });
    }

});
