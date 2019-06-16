import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { set } from '@ember/object';

module('Integration | Helper | msToMin', function(hooks) {
  setupRenderingTest(hooks);

  // Replace this with your real tests.
  test('it renders', async function(assert) {
    set(this, 'inputValue', '1234');

    await render(hbs`{{ms-to-min inputValue}}`);

    assert.equal(this.element.textContent.trim(), '1234');
  });
});
