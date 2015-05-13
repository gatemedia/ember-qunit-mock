import Ember from 'ember';
import Mock from './mock';
import { test as qunitTest } from 'qunit';
import { getContext } from 'ember-test-helpers';

export function test (testName, callback, wrapped) {
  function wrapper (assert) {
    var context = getContext(),
        mocks = Ember.A();

    context.mock = function (name) {
      var mock = Mock.create({
        name: name
      });
      mocks.pushObject(mock);
      return mock;
    };

    callback.call(context, assert);

    mocks.forEach(function (mock) {
      mock.validate(assert);
    });
  }

  (wrapped || qunitTest)(testName, wrapper);
}

export default test;
