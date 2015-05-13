import Ember from 'ember';
import { module, test } from 'qunit';
import { setContext } from 'ember-test-helpers';
import mockTest from 'ember-qunit-mock/lib/test';

module('test');

test('context has mock helper injected', function (assert) {
  assert.expect(3);

  var ran = false;

  mockTest('dummy test', function (a) {
    ran = true;
    assert.deepEqual(assert, a, 'Assert object is passed');
    assert.ok(typeof this.mock === 'function', 'Helper this.mock is injected');
  }, forgeRunner(assert));

  assert.ok(ran, 'Wrapped test was run');
});


test('mocks are validated after test', function (assert) {
  assert.expect(2);

  var fakeAsserter = forgeAsserter();
  mockTest('dummy test', function () {
    var mock = this.mock();

    mock.expect('bam');
  }, forgeRunner(fakeAsserter));

  assert.deepEqual(fakeAsserter.calls, [
    ['equal', 1, 0, 'Mock <anonymous> expected 1 call for "bam", got 0']
  ], 'Assertions are as expected');


  fakeAsserter = forgeAsserter();
  mockTest('dummy test', function () {
    var mock = this.mock('MyMock');

    mock.expect('bim');
    mock.expect('bam');
  }, forgeRunner(fakeAsserter));

  assert.deepEqual(fakeAsserter.calls, [
    ['equal', 1, 0, 'Mock <MyMock> expected 1 call for "bim", got 0'],
    ['equal', 1, 0, 'Mock <MyMock> expected 1 call for "bam", got 0']
  ], 'Assertions are as expected');
});


test('mock validation check method name', function (assert) {
  assert.expect(1);

  var fakeAsserter = forgeAsserter();
  mockTest('dummy test', function () {
    var mock = this.mock('MyMock');

    mock.expect('bam');
    mock.bam();
  }, forgeRunner(fakeAsserter));

  assert.deepEqual(fakeAsserter.calls, [
    ['equal', 1, 1, 'Mock <MyMock> expected 1 call for "bam", got 1']
  ], 'Assertions are as expected');
});


test('mock validation check arguments', function (assert) {
  assert.expect(1);

  var fakeAsserter = forgeAsserter();
  mockTest('dummy test', function () {
    var mock = this.mock();

    mock.expect('bam').withArgs(42, "hop", { k: 'v' });
    mock.bam(36, 'paf');
  }, forgeRunner(fakeAsserter));

  assert.deepEqual(fakeAsserter.calls, [
    ['equal', 1, 1, 'Mock <anonymous> expected 1 call for "bam", got 1'],
    ['deepEqual', 42, 36, '[<anonymous>.bam - call #1] expected call(42, ...)'],
    ['deepEqual', "hop", "paf", '[<anonymous>.bam - call #1] expected call(..., hop, ...)'],
    ['deepEqual', {"k":"v"}, undefined, '[<anonymous>.bam - call #1] expected call(..., {k: v})']
  ], 'Assertions are as expected');
});


function forgeRunner (assert) {
  function f (testName, callback) {
    setContext({});
    callback(assert);
  }
  return f;
}

function forgeAsserter () {
  return {
    calls: Ember.A(),

    storeCall: function (name, args) {
      var a = Ember.A(Array.prototype.slice.call(args));
      a.insertAt(0, name);
      this.calls.pushObject(a);
    },

    equal: function () {
      this.storeCall('equal', arguments);
    },
    deepEqual: function () {
      this.storeCall('deepEqual', arguments);
    }
  };
}
