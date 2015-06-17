import { module, test } from 'qunit';
import Mock from 'ember-qunit-mock/lib/mock';
import { ANYTHING } from 'ember-qunit-mock/lib/test';

module('Mock');

test('cannot define method more than once', function (assert) {
  let mock = Mock.create({
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


test('support redefinition of Ember.Object methods', function (assert) {
  let mock = Mock.create({
    name: 'Stuff'
  });

  mock.expect('get').returns(42);
  assert.equal(mock.get(), 42, 'Native primitive has been redefined');
  mock.validate(assert);
});


test('support multiple calls with single default return value', function (assert) {
  let mock = Mock.create({
    name: 'Stuff'
  });

  mock.expect('process').exactly(3).returns(42);
  assert.equal(mock.process(), 42, 'First call returned expected value');
  assert.equal(mock.process(), 42, 'Second call returned expected value');
  assert.equal(mock.process(), 42, 'Third call returned expected value');
  mock.validate(assert);
});


test('support multiple calls with constrainted args (last constraint lasts)', function (assert) {
  let mock = Mock.create({
    name: 'Stuff'
  });

  mock.expect('process')
    .withArgs('a')
    .withArgs('b')
    .exactly(3).returns(42);
  assert.equal(mock.process('a'), 42, 'First call returned expected value');
  assert.equal(mock.process('b'), 42, 'Second call returned expected value');
  assert.equal(mock.process('b'), 42, 'Third call returned expected value');
  mock.validate(assert);
});


test('support multiple calls with constrainted results (last result lasts)', function (assert) {
  let mock = Mock.create({
    name: 'Stuff'
  });

  mock.expect('process')
    .exactly(3)
    .returns(42)
    .returns(36);
  assert.equal(mock.process(), 42, 'First call returned expected value');
  assert.equal(mock.process(), 36, 'Second call returned expected value');
  assert.equal(mock.process(), 36, 'Third call returned expected value');
  mock.validate(assert);
});


test('support multiple calls with both constrainted args & results (last args & result lasts)', function (assert) {
  let mock = Mock.create({
    name: 'Stuff'
  });

  mock.expect('process')
    .withArgs('a')
    .withArgs('b')
    .exactly(4)
    .returns(42)
    .returns(36)
    .returns(81);
  assert.equal(mock.process('a'), 42, 'First call returned expected value');
  assert.equal(mock.process('b'), 36, 'Second call returned expected value');
  assert.equal(mock.process('b'), 81, 'Third call returned expected value');
  assert.equal(mock.process('b'), 81, 'Fourth call returned expected value');
  mock.validate(assert);
});


test('support ANYTHING argument', function (assert) {
  let mock = Mock.create({
    name: 'Stuff'
  });

  mock.expect('process')
    .withArgs(ANYTHING)
    .withArgs(ANYTHING)
    .withArgs(42, ANYTHING)
    .withArgs(42, ANYTHING)
    .withArgs(ANYTHING, 42)
    .withArgs(42, ANYTHING, 42)
    .exactly(6);

  mock.process();
  mock.process(0);
  mock.process(42);
  mock.process(42, 1);
  mock.process(3, 42);
  mock.process(42, 4, 42);

  mock.validate(assert);
});
