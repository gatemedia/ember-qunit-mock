import Ember from 'ember';
import CallExpectation from './call-expectation';

export default Ember.Object.extend({
  calls: null,
  expectations: null,

  init: function () {
    this.setProperties({
      calls: Ember.A(),
      expectations: Ember.A()
    });
  },

  expect: function (name) {
    var calls = this.get('calls'),
        expectations = this.get('expectations');

    var expectation = CallExpectation.create({
      name: name
    });
    expectations.pushObject(expectation);

    this[name] = function () {
      calls.pushObject({
        name: name,
        args: Array.prototype.slice.call(arguments)
      });
      return expectation.get('returnValue');
    };

    return expectation;
  },

  validate: function (assert) {
    var expectations = this.get('expectations'),
        calls = this.get('calls');

    assert.equal(expectations.get('length'), calls.get('length'), Ember.String.fmt('Expected %@ calls', expectations.get('length')));
    if (expectations.get('length') !== calls.get('length')) { return; } // for tests

    expectations.forEach(function (expectation, index) {
      assert.equal(expectation.name, calls[index].name, Ember.String.fmt('[Call #%@] Expected: "%@"', index + 1, expectation.name));
      if (expectation.args) {
        var args = calls[index].args;
        expectation.args.forEach(function (arg, i) {
          var prefix = (i === 0 ? '' : '..., '),
              suffix = (i === expectation.args.length - 1 ? '' : ', ...');
          assert.deepEqual(arg, args[i],
            Ember.String.fmt('[Call #%@] Expected: %@(%@%@%@)', index + 1, expectation.name, prefix, arg, suffix));
        });
      }
    });
  },

  toString: function () {
    return this.get('expectations').join(', ');
  }
});
