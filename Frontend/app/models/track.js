import DS from 'ember-data';
import { computed } from '@ember/object';
export default DS.Model.extend({

    Bytes: DS.attr(),
    Composer: DS.attr(),
    //mediaTypeId: DS.attr(),
    Name: DS.attr(),
    //title: DS.attr(),
    Milliseconds: DS.attr(),
    length: computed('Milliseconds', function() {
        let minutes = Math.floor(this.get('Milliseconds') / 60000);
        let seconds = ((this.get('Milliseconds') % 60000) / 1000).toFixed(0);
        return (seconds == 60 ? (minutes+1) + ":00" : minutes + ":" + (seconds < 10 ? "0" : "") + seconds);
    }),
    UnitPrice: DS.attr(),
    AlbumId: DS.attr(),
    Album: DS.belongsTo('Album'),
    Artist: DS.belongsTo('Artist'),
    Genre: DS.hasMany('Genre'),

});
