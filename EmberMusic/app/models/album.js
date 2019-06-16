import DS from 'ember-data';
import { computed, get } from '@ember/object';

export default DS.Model.extend({
    title: DS.attr(),
    artist: DS.belongsTo('artist'),
    tracks: DS.hasMany('track'),
    idNumeric: computed('id', function() {
        return parseInt(get(this, 'id'))
    }),
});
