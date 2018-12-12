import Component from '@ember/component';
import { inject as service } from '@ember/service'
import { Promise } from 'rsvp';
import { computed } from '@ember/object';
export default Component.extend({
    store: service(),
    jemapi: service(),

    showModal: false,
    selected: computed('album', function(){
       return this.get('album');
    }),
    albums: null,

    init(){

        this._super(...arguments);

        this.set('id', this.get('record').get('id'));
        this.set('name', this.get('record').get('name'));
        this.set('length', this.get('record').get('length'));
        this.set('composer', this.get('record').get('composer'));
        this.set('price', this.get('record').get('unitprice'));
    },

    actions: {
        showModal(){

            new Promise(resolve =>{
                let albumsArray = []
                 this.get('store').peekAll('album').map(album =>{
                    let id = album.get('id');
                    let name = album.get('title');
                    albumsArray.push({id:id, name:name})
                });
                resolve(albumsArray)
            }).then(albumsArray => {
                this.set('albums',albumsArray);
                let albumTitle = this.get('record.album').get('title')
                let albumId = this.get('record.album').get('id')
                this.set('album', {id:albumId , name:albumTitle});
            });
            this.set('showModal', true);
        },
        selectAlbum(album){
            this.set('selectedAlbum', album);
        },
        close(){
            this.set('showModal', false)
        },
        submit(){
            
            let trackid = this.get('id');

            let name = this.get('name');
            let albumId = this.get('selected.id');

            //let mediaTypeId = this.get('mediatypeid');
            //let genreId = this.get('genreid');
            let composer = this.get('composer');
            let length = this.minToMs(this.get('length'));
            let price = this.get('price');            

            let track = this.store.peekRecord('track', trackid)
            track.set(track.get('album').get('id'), albumId);
            track.set('name', name);
            track.set('albumid', albumId);
            track.set('composer', composer);
            track.set('length', length);
            track.set('unitprice', price);
            //track.set('title', title);
            //save track to backend and update store and ls

            this.get('jemapi').saveRecord(track);

            this.set('showModal', false);

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
