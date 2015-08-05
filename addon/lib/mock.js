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
      calls: Calls.create(),
      _original: {},
      _stub: {}
    });
  },

  expect: function (method) {
    var calls = this.calls,
        expectations = this.expectations;

    if (expectations.findBy('method', method)) {
      throw new Error(Ember.String.fmt(
        'Cannot define "%@.%@" more than once. Please use calls count constraint instead (once, twice, exactly, ...)',
        this.get('alias'), method));
    }

    var expectation = CallExpectation.create({
      method: method
    });
    expectations.pushObject(expectation);

    function stub () {
      calls.addCall(method, Array.prototype.slice.call(arguments));
      return expectation.get('returnValue');
    }

    if (this[method]) {
      this._original[method] = this[method];
    }
    this._stub[method] = stub;
    this[method] = stub;

    return expectation;
  },

  validate: function (assert) {
    this._restoreOriginals();

    var expectations = this.get('expectations'),
        alias = this.get('alias'),
        calls = this.get('calls');

    expectations.forEach(function (expectation) {
      expectation.validate(alias, calls, assert);
    });
  },

  _restoreOriginals: function () {
    Object.keys(this._original).forEach(function (method) {
      this[method] = this._original[method];
    }, this);
  },

  toString: function () {
    return this.get('expectations').join(', ');
  }
});
