import DS from 'ember-data';

export default DS.Model.extend({
    tracks: DS.hasMany('track'),
    name: DS.attr()
});
