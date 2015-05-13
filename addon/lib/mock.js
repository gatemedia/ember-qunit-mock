import Ember from 'ember';
import CallExpectation from './call-expectation';
import Calls from './calls';

export default Ember.Object.extend({
  name: '',
  calls: null,
  expectations: null,

  alias: Ember.computed('name', function () {
    var name = this.get('name');
    return Ember.String.fmt('<%@>', Ember.isEmpty(name) ? 'anonymous' : name);
  }),

  init: function () {
    this.setProperties({
      expectations: Ember.A(),
      calls: Calls.create()
    });
  },

  expect: function (method) {
    if (this[method]) {
      throw new Error(Ember.String.fmt(
        'Cannot define "%@.%@" more than once. Please use calls count constraint instead (once, twice, exactly, ...)',
        this.get('alias'), method));
    }

    var calls = this.get('calls'),
        expectations = this.get('expectations');

    var expectation = CallExpectation.create({
      method: method
    });
    expectations.pushObject(expectation);

    this[method] = function () {
      calls.addCall(method, Array.prototype.slice.call(arguments));
      return expectation.get('returnValue');
    };

    return expectation;
  },

  validate: function (assert) {
    var expectations = this.get('expectations'),
        alias = this.get('alias'),
        calls = this.get('calls');

    expectations.forEach(function (expectation) {
      expectation.validate(alias, calls, assert);
    });
  },

  toString: function () {
    return this.get('expectations').join(', ');
  }
});
