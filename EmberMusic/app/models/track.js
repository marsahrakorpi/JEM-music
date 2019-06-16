import DS from 'ember-data';
import { computed } from '@ember/object';
import { get } from '@ember/object';

export default DS.Model.extend({

    bytes: DS.attr(),
    composer: DS.attr(),
    //mediaTypeId: DS.attr(),
    name: DS.attr(),
    //title: DS.attr(),
    milliseconds: DS.attr(),
    length: computed('milliseconds', function() {
        let minutes = Math.floor(get(this, 'milliseconds') / 60000);
        let seconds = ((get(this, 'milliseconds') % 60000) / 1000).toFixed(0);
        return (seconds == 60 ? (minutes+1) + ":00" : minutes + ":" + (seconds < 10 ? "0" : "") + seconds);
    }),
    idNumeric: computed('id', function() {
        return parseInt(get(this, 'id'))
    }),
    unitPrice: DS.attr(),
    album: DS.belongsTo('album'),
    artist: DS.belongsTo('artist'),
    genre: DS.hasMany('Genre'),

});
