import DS from 'ember-data';

export default DS.Model.extend({
    title: DS.attr(),
    artist: DS.belongsTo('artist'),
    tracks: DS.hasMany('track'),

});
