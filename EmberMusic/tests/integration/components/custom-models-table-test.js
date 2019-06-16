import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | custom-models-table', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with set(this, 'myProperty', 'value');
    // Handle any actions with set(this, 'myAction', function(val) { ... });

    await render(hbs`{{custom-models-table}}`);

    assert.equal(this.element.textContent.trim(), '');

    // Template block usage:
    await render(hbs`
      {{#custom-models-table}}
        template block text
      {{/custom-models-table}}
    `);

    assert.equal(this.element.textContent.trim(), 'template block text');
  });
});
