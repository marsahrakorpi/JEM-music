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
        this.set('loading', true)
        this.columns = [
            {propertyName: "id", title:"#"},
            {propertyName: 'name'},
            {propertyName: 'title', title:"Album"},
            {propertyName: 'length', tile:"Length"},
            {component: 'music-preview'},
        ];

        this.set('loading', false);

        this.set('data', this.get('store').peekAll('track'));
    },

    actions: {
        transitionTo(){
            this.transitionToRoute('/') 
        }
    }


});
