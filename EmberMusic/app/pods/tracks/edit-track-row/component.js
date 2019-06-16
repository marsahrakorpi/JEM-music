import Component from '@ember/component';
import { inject as service } from '@ember/service'
import { Promise } from 'rsvp';
import { get, set, computed } from '@ember/object';
export default Component.extend({
    store: service(),
    api: service(),

    showModal: false,
    selected: computed('album', function(){
       return get(this, 'album');
    }),
    albums: null,

    init(){

        this._super(...arguments);

        set(this, 'id', get(this, 'record.id'));
        set(this, 'name', get(this, 'record.name'));
        set(this, 'length', get(this, 'record.milliseconds'));
        set(this, 'composer', get(this, 'record.composer'));
        set(this, 'price', get(this, 'record.unitPrice'));
    },

    actions: {
        showModal(){

            new Promise(resolve =>{
                let albumsArray = []
                 get(this, 'store').peekAll('album').map(album =>{
                    let id = album.get('id');
                    let name = album.get('title');
                    albumsArray.push({id:id, name:name})
                });
                resolve(albumsArray)
            }).then(albumsArray => {
                set(this, 'albums',albumsArray);
                let albumTitle = get(this, 'record.album.title')
                let albumId = get(this, 'record.album.id')
                set(this, 'album', {id:albumId , name:albumTitle});
            });
            set(this, 'showModal', true);
        },
        selectAlbum(album){
            set(this, 'selectedAlbum', album);
        },
        close(){
            set(this, 'showModal', false)
        },
        submit(){
            
            let trackid = get(this, 'id');

            let name = get(this, 'name');
            let albumId = get(this, 'selected.id');

            //let mediaTypeId = get(this, 'mediatypeid');
            //let genreId = get(this, 'genreid');
            let composer = get(this, 'composer');
            let length = get(this, 'length');
            let price = get(this, 'price');            

            let track = this.store.peekRecord('track', trackid)

            //get album relation
            if(albumId){
                set(track, 'album', get(this, 'store').peekRecord('album', albumId));
            }
            

            track.set('name', name);
            track.set('composer', composer);
            track.set('milliseconds', length);
            track.set('unitPrice', price);

            get(this, 'api').saveRecord(track);

            set(this, 'showModal', false);

        }
    },
    minToMs(millis){
        try{
            let split = millis.split(":");
            let min = split[0] * 60000;
            let sec = split[1] * 1000;
    
            return min+sec;
        } catch (e) {
            return millis
        }

    }

});
