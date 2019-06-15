import Component from '@ember/component';

export default Component.extend({
    data: null,
    columns: null,
    themeInstane: null,
    showGlobalFilter: null,
    filteringIgnoreCase: true,
    pageSize: 25,
    init(){
        this._super(...arguments);

        this.data=this.get('data') ;
        this.columns=this.get('columns');
        this.themeInstance=this.get('themeInstance');
        this.showGlobalFilter=this.get('showGlobalFilter');
        this.filteringIgnoreCase = this.get('filteringIgnoreCase')
        this.pageSize=this.get('pageSize')

    },
});
