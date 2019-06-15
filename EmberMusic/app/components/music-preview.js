import Component from '@ember/component';
import { inject as service } from '@ember/service'
import { Promise, resolve, reject } from 'rsvp';

export default Component.extend({
    spotify: service(),
    store: service(),
    source: null,
    spotifyRecord: null,


    init(){
        this._super(...arguments);
        this.trackName = this.get('record').Name;

        this.setSource(this.get('record'));

    },

    getAlbum(record){
        return new Promise(resolve => {
            /*
            *   Tries to peek store for the album
            *   if it's not in the store, find it from backend
            */

            if(record.get('Album') === undefined || record.get('Album') === null){
                resolve();
            }
            
            let albumid = record.get('Album').get('id');
            if(albumid === undefined || albumid === null){
                return;
            }
            let album = this.get('store').peekRecord('album', albumid);

            if(!album && albumid){
                album = this.get('store').findRecord('album', albumid).then((album)=>{
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
        let record = this.get('record');
        let track = this.get('spotify').getTrackSingle(record.Name)

        track.then(track => {

            this.getAlbum(record).then((album)=>{

                this.set('loading', true);
                this.set('spotifyRecordArray', track.tracks.items)
        
                for(var i = 0; i < this.get('spotifyRecordArray').length; i++) {
                    if (this.get('spotifyRecordArray')[i].album.name.toLowerCase() === album.get('Title').toLowerCase()) {
                        this.set('spotifyRecord', this.get('spotifyRecordArray')[i]);
                        break; 
                    }
                }
    
                if(!this.get('spotifyRecordArray')[0]){
                    this.set('loading', false)
                    return
                }
                if(this.get('spotifyRecord')!=null){
                    this.set('source', this.get('spotifyRecord').preview_url);
                    
                } else{
                    //HAVING THIS ENABLED WILL SOMETIMES GIVE WRONG RESULTS FOR TRACKS... 
                    this.set('source', this.get('spotifyRecordArray')[0].preview_url);
                }
    
                this.set('loading', false)
            })

        })

    }
});
