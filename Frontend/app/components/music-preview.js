import Component from '@ember/component';
import { inject as service } from '@ember/service'
export default Component.extend({
    spotify: service(),
    source: null,
    spotifyRecord: null,


    init(){
        this._super(...arguments);
        this.trackName = this.get('record').name;

        this.setSource();

    },

    setSource(){
        let track = this.get('spotify').getTrackSingle(this.get('trackName'));
        this.set('spotifyRecord', track.tracks.items[0])
        this.set('source', this.get('spotifyRecord').preview_url);
    }
});
