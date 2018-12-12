import Controller from '@ember/controller';
import SemanticUiTheme from '../themes/semanticui';
import { inject as service } from '@ember/service'
import { Promise, resolve, reject } from 'rsvp'
import { computed } from '@ember/object'
import { later } from '@ember/runloop';
export default Controller.extend({
    jemapi: service(),

    themeInstance: SemanticUiTheme.create(),
    loading: false,
    columns: null,
    pageSizeValues: [10, 25, 50, 100, 200],
    data: null,

    init(){
        this._super(...arguments);

        this.columns = [
            {component: 'edit-track-row'},
            {component: 'delete-track-row'},
            {propertyName: "id", title:"#"},
            {propertyName: 'name'},
            {propertyName: 'album.title', title:"Album"},
            {propertyName: 'length', tile:"Length", value: length},
            {propertyName: 'composer', title:"Composer"},
            {propertyName: 'unitprice', title:"Price"},
            {component: 'music-preview'},

        ];
        this.data = this.get('store').peekAll('track');

    },

    actions: {
        transitionTo(){
            this.transitionToRoute('/') 
        }
    }


});
