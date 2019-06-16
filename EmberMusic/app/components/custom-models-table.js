import Component from '@ember/component';
import { get } from '@ember/object';
export default Component.extend({
    data: null,
    columns: null,
    themeInstane: null,
    showGlobalFilter: null,
    filteringIgnoreCase: true,
    pageSize: 25,
    init(){
        this._super(...arguments);

        this.data=get(this, 'data') ;
        this.columns=get(this, 'columns');
        this.themeInstance=get(this, 'themeInstance');
        this.showGlobalFilter=get(this, 'showGlobalFilter');
        this.filteringIgnoreCase = get(this, 'filteringIgnoreCase')
        this.pageSize=get(this, 'pageSize')

    },
});
