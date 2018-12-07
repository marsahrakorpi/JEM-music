import DS from 'ember-data';

export default DS.Model.extend({
    genreId: DS.hasMany('track'),
    name: DS.attr()
});
