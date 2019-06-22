import Component from '@ember/component';
import SemanticUiTheme from 'EmberMusic/themes/semanticui';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';

export default Component.extend({
    api: service(),
    session: service(),
    themeInstance: SemanticUiTheme.extend({table: 'ui sortable selectable table'}).create(),
    loading: false,
    columns: null,
    pageSizeValues: null,
    data: null,

    queryParams: ["limit", "page"],

    limit:50,
    page: 1,

    spotify:false,

    init(){
        this._super(...arguments);
        //{propertyName: "id", title:"#"},
        this.columns = [
            {propertyName: 'idNumeric', title:"Id"},
            {propertyName: 'name', title:"Name"},
            {propertyName: 'album.title', title:"Album"},
            {propertyName: 'album.name', title:"Artist", "sortDirection": "asc", "sortPrecedence": 1},
            {propertyName: 'length', title:"Length", value: length},
            {propertyName: 'genre.name', title: "Genre"},
            {propertyName: 'unitPrice', title:"Price"},
        ];

        if(get(this, 'spotify')!=false) get(this, 'columns').push({component: 'music-preview', title:"Preview"},)
        if(get(this, 'session').isAuthenticated){
            get(this, 'columns').push({component: 'tracks/edit-track-row', title:"Edit"})
            get(this, 'columns').push({component: 'tracks/delete-track-row', title:"Remove"})
        }
        this.pageSizeValues = [10, 25, 50, 100, 200];

    },

    actions: {
        transitionTo(){
            this.transitionToRoute('/') 
        }
    }


});
