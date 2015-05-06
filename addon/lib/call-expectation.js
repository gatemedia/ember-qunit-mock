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
  name: null,
  args: null,
  value: null,

  withArgs: function () {
    this.set('args', Array.prototype.slice.call(arguments));
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

  toString: function () {
    var name = this.get('name'),
        args = this.get('args'),
        value = this.get('value');
    if (typeof value === 'function') {
      value = 'func';
    }
    return Ember.String.fmt('%@(%@) -> %@', name, args.map(function (arg) {
      return repr(arg);
    }).join(', '), value);
  }
});
