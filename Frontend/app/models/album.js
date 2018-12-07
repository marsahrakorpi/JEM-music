import DS from 'ember-data';
import { computed } from '@ember/object';
export default DS.Model.extend({
    title: DS.attr('string'),
    //artistId: DS.belongsTo('artist'),
    name: DS.attr('string'),
    tracks: DS.hasMany('track'),

});
