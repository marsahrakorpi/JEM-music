import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | delete-table-row-button', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with set(this, 'myProperty', 'value');
    // Handle any actions with set(this, 'myAction', function(val) { ... });

    await render(hbs`{{delete-table-row-button}}`);

    assert.equal(this.element.textContent.trim(), '');

    // Template block usage:
    await render(hbs`
      {{#delete-table-row-button}}
        template block text
      {{/delete-table-row-button}}
    `);

    assert.equal(this.element.textContent.trim(), 'template block text');
  });
});
