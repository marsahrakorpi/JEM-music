import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { get, set, computed } from '@ember/object';

export default Component.extend({
    store: service(),
    api: service(),
    notifications: service('notification-messages'),

    selectedAlbum: computed('album', function(){
        return get(this, 'album');
    }),
    selectedArtist: computed('artist', function(){
        return get(this, 'artist');
    }),

    albums: null,
    artists: null,

    init(){
        this._super(...arguments);
        this.albums = get(this, 'store').peekAll('album').map(album =>{
           let id = album.get('id');
           let name = album.get('title');
           return {id:id, name:name}
       });

        this.artists = get(this, 'store').peekAll('artist').map(artist =>{
            let id = artist.get('id');
            let name = artist.get('name');
            return {id:id, name:name}
        });
    },

    actions:{
        addTrack(){
            let name = get(this, 'name');
            let album = get(this, 'selectedArtist.id');
            let artist = get(this, 'selectedArtist.id');
            //let mediaTypeId = get(this, 'mediatypeid');
            //let genreId = get(this, 'genreid');
            let composer = get(this, 'composer');
            let length = get(this, 'length');
            let price = get(this, 'price');    
            let bytes = get(this, 'bytes'); 

            let validate = [name, album, artist, price];
            let check = function(element) { return element === undefined || element === null}
            if(validate.some(check)){
            
                get(this, 'notifications').error("Mandatory info missing!", {
                    autoClear: true,
                    clearDuration: 2000
                });
                return;
            }

            let record = get(this, 'store').createRecord('track', {
                name: name,
                composer: composer,
                milliseconds: length,
                unitPrice: price,
                bytes: bytes,
            })
            let artistRelation = get(this, 'store').peekRecord('artist', artist);
            let albumRelation = get(this, 'store').peekRecord('album', album);
            set(record, 'artist', artistRelation);
            set(record, 'album', albumRelation);
            get(this, 'api').saveRecord(record);
            this.closeModal();

        },

        close(){
            this.closeModal()
        }
    }
});
