import DS from 'ember-data';

export default DS.Model.extend({
    Title: DS.attr('string'),
    Artist: DS.belongsTo('Artist', {async: true}),
    Tracks: DS.hasMany('Track'),

});
