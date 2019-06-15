import Component from '@ember/component';
export default Component.extend({

    actions: {
        collapseRow(index, record) {
          this.set('isExpanded', false)
          this.get('collapseRow')(index, record);
        },
        expandRow(index, record) {
          this.set('isExpanded', true)
          this.get('expandRow')(index, record);
        }
      }
      
});
