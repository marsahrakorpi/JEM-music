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
            {propertyName: "id", title:"#"},
            {propertyName: 'name'},
            {propertyName: 'title', title:"Album"},
            {propertyName: 'length', tile:"Length"},
            {component: 'search-for-artist', title:"Artist"},

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
