import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
    primaryKey: "_id",
    keyForAttribute(attr) {
        return Ember.String.underscore(attr);
    }
});
