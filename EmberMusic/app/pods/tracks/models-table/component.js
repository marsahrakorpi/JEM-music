import Component from '@ember/component';
import SemanticUiTheme from 'EmberMusic/themes/semanticui';
import { inject as service } from '@ember/service';
import { get, set, computed } from '@ember/object';

export default Component.extend({
    api: service(),
    session: service(),
    themeInstance: SemanticUiTheme.extend({table: 'ui sortable selectable table'}).create(),
    loading: false,
    columns: null,
    pageSizeValues: null,
    data: null,

    spotify:true,

    totalPages: computed('totalRecords', 'limit', function(){
        let total = get(this,'totalRecords');
        let limit = get(this, 'limit');
        return Math.ceil(total/limit);
    }),

    firstIndex: computed('page', 'limit', function(){
        let limit = get(this, 'limit');
        let page = get(this, 'page');
        let firstIndex = (limit*page) - limit + 1 ;
        return firstIndex;
    }),
    lastIndex: computed('page', 'limit', function(){
        let limit = get(this, 'limit');
        let page = get(this, 'page');
        let lastIndex = (limit*page)
        return lastIndex;
    }),

    init(){
        this._super(...arguments);
        //{propertyName: "id", title:"#"},
        this.columns = [
            {propertyName: 'name', title:"Name"},
            {propertyName: 'album.title', title:"Album"},
            {propertyName: 'album.artist.name', title:"Artist", "sortDirection": "asc", "sortPrecedence": 1},
            {propertyName: 'length', title:"Length", value: length},
            {propertyName: 'genre.name', title: "Genre"},
            {propertyName: 'unitPrice', title:"Price"},
        ];

        if(get(this, 'session').isAuthenticated){
            get(this, 'columns').push({component: 'music-preview', title:"Preview"})
            get(this, 'columns').push({component: 'tracks/edit-track-row', title:"Edit"})
            get(this, 'columns').push({component: 'tracks/delete-track-row', title:"Remove"})
        }
        this.pageSizeValues = [10, 25, 50, 100, 200];
    },

    actions: {
        transitionTo(){
            this.transitionToRoute('/') 
        },

        goToPage(page){
            set(this, 'page', page)
        }
    }


});
