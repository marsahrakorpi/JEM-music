import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | login-modal', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with set(this, 'myProperty', 'value');
    // Handle any actions with set(this, 'myAction', function(val) { ... });

    await render(hbs`{{login-modal}}`);

    assert.equal(this.element.textContent.trim(), '');

    // Template block usage:
    await render(hbs`
      {{#login-modal}}
        template block text
      {{/login-modal}}
    `);

    assert.equal(this.element.textContent.trim(), 'template block text');
  });
});
