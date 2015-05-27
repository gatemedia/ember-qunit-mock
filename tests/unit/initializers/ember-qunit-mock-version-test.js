import initializer from '../../../initializers/ember-qunit-mock-version';
import { module, test } from 'qunit';
import config from '../../../config/environment';

module('Version initializer');

test('version is sync', function(assert) {
  assert.equal(initializer.initialize(), config.APP.VERSION, 'version is sync between initializer & package');
});
