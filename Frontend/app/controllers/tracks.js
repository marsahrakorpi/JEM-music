import Controller from '@ember/controller';
import SemanticUiTheme from '../themes/semanticui';

export default Controller.extend({

    themeInstance: SemanticUiTheme.create(),

    columns: null,
    init(){
        this._super(...arguments);
        this.columns = [
            {propertyName: 'Track_Name'},
            {propertyName: 'Album_Title'},
            {propertyName: 'Artist_Name'}
        ]
    },

});
