import DS from 'ember-data';
import { computed } from '@ember/object';
export default DS.Model.extend({

    bytes: DS.attr(),
    composer: DS.attr(),
    //mediaTypeId: DS.attr(),
    name: DS.attr(),
    price: DS.attr(),
    milliseconds: DS.attr(),
    trackid: DS.attr(),
    unitprice: DS.attr(),
    warbosses: DS.hasMany('track'),
    album: DS.belongsTo('album'),

    genre: DS.belongsTo('genre'),
    idNumeric: computed('id', function () {
        return parseInt(this.get('id'), 10);
    })

});
