import Service, { inject as service } from '@ember/service'; 
import ENV from '../config/environment'
import $ from 'jquery'
import { run } from '@ember/runloop'
import { get, set } from '@ember/object';
export default Service.extend({
    session: service(),

    getSingleTrack(track, album=null, artist=null){
        /*Track, album, artist should all be strings*/
        if(!track) throw new Error('Spotify getSingleTrack() did not receive the track parameter');
        let access_token = get(this, 'session.data.authenticated.access_token');
        if(!access_token){
            get(this, 'session').invalidate();
            window.location.reload();
            return
        }
        return new Promise((resolve,reject) => {
            $.ajax({
                url: ENV.apiURL+'/spotify/search',
                method: "POST",
                headers: {
                    "Authorization": "Bearer "+access_token
                },
                data: {
                    type:"track",
                    track:track,
                    album:album,
                    artist:artist
                },
                success: (res => {
                    resolve(res);
                }),
                error:(err => {
                    reject(err);
                })
            })
        });

    },
    getTrackSingle(searchTerm){
        /**** DEPRECATED *****/
        throw new Error('This method has been deprecated in favor of using serverless. Use getSingleTrack(track, album, artist) instead.')
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
