import { module, test } from 'qunit';
import Mock from 'ember-qunit-mock/lib/mock';

module('mock');

test('cannot define method more than once', function (assert) {
  var mock = Mock.create({
    name: 'Stuff'
  });

  mock.expect('doSomething');
  assert.throws(
    function () {
      mock.expect('doSomething');
    },
    new Error('Cannot define "<Stuff>.doSomething" more than once. Please use calls count constraint instead (once, twice, exactly, ...)'),
    'Defining method twice throws expected error');
});
