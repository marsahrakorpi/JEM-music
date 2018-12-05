import Route from '@ember/routing/route';
import { get, set } from '@ember/object'


export default Route.extend({

    track: null,
    limit: 25,

    page: 1,



    model(){
        if(this.get('store').peekRecord('track', 1)){
            console.log("Tracks loaded in store, can peek");
            return this.get('store').peekAll('track');
        } else {
            return this.get('store').findAll('track')
        }
        
    }


});
