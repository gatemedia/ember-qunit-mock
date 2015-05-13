import Ember from 'ember';

function repr (stuff) {
  switch (Ember.typeOf(stuff)) {
  case 'object':
    return Ember.String.fmt('{%@}', Ember.keys(stuff).map(function (key) {
      return Ember.String.fmt("%@:%@", key, repr(stuff[key]));
    }).join(', '));
  case 'array':
    return Ember.String.fmt('[%@]', stuff.map(function (item) {
      return repr(item);
    }).join(', '));
  case 'string':
    return Ember.String.fmt('"%@"', stuff);
  default:
    return Ember.inspect(stuff);
  }
}

export default Ember.Object.extend({
  method: null,
  count: null,
  args: null,
  value: null,

  init: function () {
    this._super();
    this.setProperties({
      count: 1,
      args: Ember.A()
    });
  },

  withArgs: function () {
    this.get('args').pushObject(Array.prototype.slice.call(arguments));
    return this;
  },
  once: function () {
    this.set('count', 1);
    return this;
  },
  twice: function () {
    this.set('count', 2);
    return this;
  },
  exactly: function (count) {
    this.set('count', count);
    return this;
  },
  returns: function (value) {
    this.set('value', value);
    return this;
  },

  returnValue: Ember.computed('value', function () {
    var value = this.get('value');

    if (typeof value === 'function') {
      return value.call(this.get('args'));
    }
    return value;
  }).volatile(),

  validate: function (alias, calls, assert) {
    var expectedMethod = this.get('method'),
        expectedCount = this.get('count'),
        methodCalls = calls.callsForMethod(expectedMethod),
        gotCount = methodCalls.get('length');

    assert.equal(expectedCount, gotCount,
      Ember.String.fmt('Mock %@ expected %@ %@ for "%@", got %@',
        alias,
        expectedCount,
        expectedCount === 0 ? 'no call' : (expectedCount === 1 ? 'call' : 'calls'),
        expectedMethod,
        gotCount));
    if (expectedCount !== gotCount) { return; } // for tests

    var expectedArgs = this.get('args');
    if (expectedArgs.get('length') < expectedCount) {
      var lastArgs = expectedArgs.get('lastObject') || [];
      for (var i = expectedArgs.get('length'); i <= expectedCount; ++i) {
        expectedArgs.pushObject(Ember.copy(lastArgs, true));
      }
    }
    expectedArgs = expectedArgs.slice(0, expectedCount);

    expectedArgs.forEach(function (args, index) {
      var callArgs = methodCalls[index].args;

      args.forEach(function (arg, i) {
        var prefix = (i === 0 ? '' : '..., '),
            suffix = (i === args.length - 1 ? '' : ', ...');
        assert.deepEqual(arg, callArgs[i],
          Ember.String.fmt('[%@.%@ - call #%@] expected call(%@%@%@)', alias, expectedMethod, index + 1, prefix, arg, suffix));
      });
    });
  },

  toString: function () {
    var method = this.get('method'),
        args = this.get('args'),
        value = this.get('value');
    if (typeof value === 'function') {
      value = 'func';
    }
    return Ember.String.fmt('%@(%@) -> %@', method, args.map(function (arg) {
      return repr(arg);
    }).join(', '), value);
  }
});
