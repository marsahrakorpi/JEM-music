import Component from '@ember/component';
import { inject as service } from '@ember/service'
import { Promise } from 'rsvp';
import { get, set } from '@ember/object';

export default Component.extend({
    spotify: service(),
    store: service(),
    source: null,
    spotifyRecord: null,


    init(){
        this._super(...arguments);
        this.trackName = get(this,'record.name');
        this.setSource(get(this,'record'));

    },

    getAlbum(record){
        return new Promise((resolve, reject) => {
            /*
            *   Tries to peek store for the album
            *   if it's not in the store, find it from backend
            */

            if(get(record, 'album') === undefined || get(record, 'album') === null){
                resolve();
            }
            
            let albumid = get(record, 'album').get('id');
            if(albumid === undefined || albumid === null){
                return;
            }
            let album = get(this, 'store').peekRecord('album', albumid);

            if(!album && albumid){
                album = get(this, 'store').findRecord('album', albumid).then((album)=>{
                    resolve(album);
                }).catch(() => {
                    reject(new Error("Could not find the album for the record"));
                })
            }else {
                resolve(album);
            } 
            
        
        })
    },
    setSource(){
        let record = get(this, 'record');
        let track = get(this, 'spotify').getTrackSingle(record.name)

        track.then(track => {

            this.getAlbum(record).then((album)=>{
                set(this, 'loading', true);
                set(this, 'spotifyRecordArray', track.tracks.items)
        
                for(var i = 0; i < get(this,'spotifyRecordArray').length; i++) {
                    if (get(this,'spotifyRecordArray')[i].album.name.toLowerCase() === album.get('title').toLowerCase()) {
                        set(this, 'spotifyRecord', get(this, 'spotifyRecordArray')[i]);
                        break; 
                    }
                }
    
                if(!get(this,'spotifyRecordArray')[0]){
                    set(this, 'loading', false)
                    return
                }
                if(get(this,'spotifyRecord')!=null){
                    set(this, 'source', get(this, 'spotifyRecord').preview_url);
                     
                } else{
                    //HAVING THIS ENABLED WILL SOMETIMES GIVE WRONG RESULTS FOR TRACKS... 
                    set(this, 'source', get(this, 'spotifyRecordArray')[0].preview_url);
                }
    
                set(this, 'loading', false)
            })

        })

    }
});
