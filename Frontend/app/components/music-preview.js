import Component from '@ember/component';
import { inject as service } from '@ember/service'
import { Promise, resolve, reject } from 'rsvp';
export default Component.extend({
    spotify: service(),
    source: null,
    spotifyRecord: null,


    init(){
        this._super(...arguments);
        this.trackName = this.get('record').name;
        this.album = this.get('record').title;
        this.setSource();

    },

    setSource(){
        let track = this.get('spotify').getTrackSingle(this.get('trackName'))

        track.then(track => {
            this.set('loading', true);
            this.set('spotifyRecordArray', track.tracks.items)
            console.log(track);
            let album = this.get('album')
    
            for(var i = 0; i < this.get('spotifyRecordArray').length; i++) {
                if (this.get('spotifyRecordArray')[i].album.name == album) {
                    this.set('spotifyRecord', this.get('spotifyRecordArray')[i]);
                    break; 
                }
            }
            if(!this.get('spotifyRecordArray')[0]){
                this.set('loading', false)
                return
            }
            if(this.get('spotifyRecord')){
                this.set('source', this.get('spotifyRecord').preview_url);
                
            } else {
                this.set('source', this.get('spotifyRecordArray')[0].preview_url);
            }
            this.set('loading', false)
        })

    }
});
