import Controller from '@ember/controller';
import SemanticUiTheme from '../themes/semanticui';
import { inject as service } from '@ember/service';

export default Controller.extend({
    api: service(),

    themeInstance: SemanticUiTheme.create(),

    columns: null,

    init(){
        this._super(...arguments);

        this.columns = [
            {component: 'expand-row', disableFiltering: true, mayBeHidden: false},
            {propertyName: 'id', sortedBy: 'idNumeric'},
            {propertyName: 'Title', title: "Album Title"},
            {propertyName: 'Artist.Name', title:"Artist"},

        ];

    },

    actions: {
        transitionTo(){
            this.transitionToRoute('/') 
        }
    }


});
