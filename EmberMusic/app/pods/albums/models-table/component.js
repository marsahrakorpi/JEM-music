import Component from '@ember/component';
import SemanticUiTheme from 'EmberMusic/themes/semanticui';
import { inject as service } from '@ember/service';
import { get, set, computed } from '@ember/object';
export default Component.extend({
    api: service(),

    themeInstance: SemanticUiTheme.create(),

    columns: null,

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

        this.columns = [
            {component: 'expand-row', disableFiltering: true, mayBeHidden: false},
            {propertyName: 'title', title: "Album Title", "sortDirection": "asc", "sortPrecedence": 1},
            {propertyName: 'artist.name', title:"Artist"},
        ];

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
