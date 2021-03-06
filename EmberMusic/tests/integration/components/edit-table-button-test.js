import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | edit-table-button', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with set(this, 'myProperty', 'value');
    // Handle any actions with set(this, 'myAction', function(val) { ... });

    await render(hbs`{{edit-table-button}}`);

    assert.equal(this.element.textContent.trim(), '');

    // Template block usage:
    await render(hbs`
      {{#edit-table-button}}
        template block text
      {{/edit-table-button}}
    `);

    assert.equal(this.element.textContent.trim(), 'template block text');
  });
});
