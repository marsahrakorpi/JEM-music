import Component from '@ember/component';
import SemanticUiTheme from 'EmberMusic/themes/semanticui';
import { inject as service } from '@ember/service';

export default Component.extend({
    api: service(),

    themeInstance: SemanticUiTheme.create(),

    columns: null,

    init(){
        this._super(...arguments);

        this.columns = [
            {component: 'expand-row', disableFiltering: true, mayBeHidden: false},
            {propertyName: 'id', sortedBy: 'idNumeric'},
            {propertyName: 'title', title: "Album Title"},
            {propertyName: 'artist.name', title:"Artist"},

        ];

    },

    actions: {
        transitionTo(){
            this.transitionToRoute('/') 
        }
    }


});
