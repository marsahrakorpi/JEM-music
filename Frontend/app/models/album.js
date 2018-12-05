import DS from 'ember-data';

export default DS.Model.extend({
    Title: DS.attr(),
    Artist: DS.belongsTo('artist'),
    Tracks: DS.hasMany('track')
});
