import Ember from 'ember';
import mockTest from 'ember-qunit-mock/lib/test';
import { module, test } from 'qunit';
import { setContext } from 'ember-test-helpers';

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
    ['equal', 1, 0, 'Expected 1 calls']
  ], 'Assertions are as expected');


  fakeAsserter = forgeAsserter();
  mockTest('dummy test', function () {
    var mock = this.mock();

    mock.expect('bim');
    mock.expect('bam');
  }, forgeRunner(fakeAsserter));

  assert.deepEqual(fakeAsserter.calls, [
    ['equal', 2, 0, 'Expected 2 calls']
  ], 'Assertions are as expected');
});


test('mock validation check method name', function (assert) {
  assert.expect(1);

  var fakeAsserter = forgeAsserter();
  mockTest('dummy test', function () {
    var mock = this.mock();

    mock.expect('bam');
    mock.bam();
  }, forgeRunner(fakeAsserter));

  assert.deepEqual(fakeAsserter.calls, [
    ['equal', 1, 1, 'Expected 1 calls'],
    ['equal', 'bam', 'bam', '[Call #1] Expected: "bam"']
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
    ['equal', 1, 1, 'Expected 1 calls'],
    ['equal', 'bam', 'bam', '[Call #1] Expected: "bam"'],
    ['deepEqual', 42, 36, '[Call #1] Expected: bam(42, ...)'],
    ['deepEqual', "hop", "paf", '[Call #1] Expected: bam(..., hop, ...)'],
    ['deepEqual', {"k":"v"}, undefined, '[Call #1] Expected: bam(..., {k: v})']
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
