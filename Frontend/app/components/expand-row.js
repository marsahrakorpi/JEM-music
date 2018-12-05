import Component from '@ember/component';

export default Component.extend({
    actions: {
        collapseRow(index, record) {
         this.get('collapseRow')(index, record);
        },
        expandRow(index, record) {
          this.get('expandRow')(index, record);
        }
      }
      
});
