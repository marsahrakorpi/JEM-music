import Controller from '@ember/controller';
import SemanticUiTheme from '../themes/semanticui';
import { inject as service } from '@ember/service'

export default Controller.extend({
    jemapi: service(),

    themeInstance: SemanticUiTheme.create(),
    loading: false,
    columns: null,

    data: null,

    init(){
        this._super(...arguments);
        this.columns = [
            {component: 'edit-table-row'},
            {component: 'delete-table-row'},
            {propertyName: "id", title:"#"},
            {propertyName: 'name'},
            {propertyName: 'album.title', title:"Album"},
            {propertyName: 'length', tile:"Length", value: length},
            {propertyName: 'composer', title:"Composer"},
            {propertyName: 'unitprice', title:"Price"},
            {component: 'music-preview'},

        ];

    },

    actions: {
        transitionTo(){
            this.transitionToRoute('/') 
        }
    }


});
