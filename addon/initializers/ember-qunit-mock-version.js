import Ember from 'ember';

var VERSION = '0.0.8';
Ember.libraries.register('Ember QUnit mock', VERSION);

export default {
  name: 'ember-qunit-mock-version',
  initialize: function initialize() {
    return VERSION;
  }
};
