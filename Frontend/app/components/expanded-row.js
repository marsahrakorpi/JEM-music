import Component from '@ember/component';
import SemanticUiTheme from '../themes/semanticui';

export default Component.extend({

    internalThemeInstance: SemanticUiTheme.extend({table: 'ui sortable selectable inverted table'}).create(),
    columns: null,

    init(){
      this._super(...arguments);
      this.columns = [
        {propertyName: 'id'},
        {propertyName: 'name'},
        {component: 'music-preview'},
      ]
    }

});
