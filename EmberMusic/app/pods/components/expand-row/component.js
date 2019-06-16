import Component from '@ember/component';
import { get, set } from '@ember/object';

export default Component.extend({

    actions: {
        collapseRow(index, record) {
          set(this, 'isExpanded', false)
          get(this, 'collapseRow')(index, record);
        },
        expandRow(index, record) {
          set(this, 'isExpanded', true)
          get(this, 'expandRow')(index, record);
        }
      }
      
});
