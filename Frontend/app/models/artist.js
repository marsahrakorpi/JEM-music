import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr(),
    albums: DS.hasMany('album')
});
