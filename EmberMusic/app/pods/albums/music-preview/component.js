import Component from '@ember/component';
import { inject as service } from '@ember/service'
import { Promise } from 'rsvp';
import { get, set, computed } from '@ember/object';

export default Component.extend({
    spotify: service(),
    store: service(),
    session: service(),

    spotifyRecord: null,


    init(){
        this._super(...arguments);

        if(!get(this,'session.data.authenticated.user.spotifyToken')) return;

    },

    source: computed('record.name', function(){
        let track = get(this, 'record.name');
        let album = get(this, 'record.album.title');
        return this.getSource (track, album);
    }),

    getSource(track, album){
        let src = get(this, 'spotify').getSingleTrack(track, album)
        src.then(res => {
            set(this, 'source', res.url)
        })
    }
});
