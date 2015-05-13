import Ember from 'ember';

var Method = Ember.Object.extend({
  name: null,
  calls: null,

  init: function () {
    this._super();
    this.set('calls', Ember.A());
  },

  add: function (index, args) {
    this.get('calls').pushObject({
      index: index,
      name: this.get('name'),
      args: args
    });
  }
});

export default Ember.Object.extend({
  methods: null,
  _callIndex: null,

  count: Ember.computed('methods.@each.calls.length', function () {
    return this.get('methods').reduce(function (count, call) {
      return count + call.get('calls.length');
    }, 0);
  }),

  names: Ember.computed('methods.[]', function () {
    var names = Ember.A();
    this.get('methods').forEach(function (call) {
      names.pushObject(call.name);
    });
    return names;
  }),

  init: function () {
    this._super();
    this.setProperties({
      methods: Ember.A(),
      _callIndex: -1
    });
  },

  addCall: function (name, args) {
    var methods = this.get('methods'),
        method = methods.findBy('name', name),
        callIndex = this.incrementProperty('_callIndex');

    if (Ember.isNone(method)) {
      method = Method.create({
        name: name
      });
      methods.pushObject(method);
    }
    method.add(callIndex, args);
  },

  callsForMethod: function (name) {
    var method = this.get('methods').findBy('name', name);

    if (method) {
      return method.get('calls');
    }
    return Ember.A();
  }
});
