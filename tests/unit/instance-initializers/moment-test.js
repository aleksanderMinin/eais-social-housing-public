import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

module('Unit | Instance Initializer | moment', function(hooks) {
  setupApplicationTest(hooks);

  // Replace this with your real tests.
  test('it works', async function(assert) {
    let moment = this.owner.lookup('service:moment');

    assert.equal(moment.locale, 'ru');
    assert.equal(moment.localeOptions.longDateFormat.LL, 'D MMMM YYYY');
    assert.equal(moment.localeOptions.longDateFormat.LLL, 'D MMMM YYYY, H:mm');
    assert.equal(moment.localeOptions.longDateFormat.LLLL, 'dddd, D MMMM YYYY, H:mm');
  });
});
