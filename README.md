# ember-qunit-mock

[![NPM Version](https://img.shields.io/npm/v/ember-qunit-mock.svg?style=flat)](https://www.npmjs.org/package/ember-qunit-mock)
[![Build Status](https://travis-ci.org/gatemedia/ember-qunit-mock.svg?branch=master)](https://travis-ci.org/gatemedia/ember-qunit-mock)

This project is heavily inspired by [SinonJS](http://sinonjs.org/docs), but aims to providing assertions-friendly mocks in an [ember-qunit](https://github.com/rwjblue/ember-qunit) testing environment.

# Use it!

## Installation

`npm install --save-dev ember-qunit-mock`

## Mocking methods in tests

```
import { moduleForComponent } from 'ember-qunit';
import { test } from 'ember-qunit-mock/lib/test';

moduleForComponent('my-component', {});

test('A test using mock', function (assert) {
  var mock = this.mock('MockName');
  mock.expect('someMethod').withArgs('arg', 10).returns(42);

  // Test logic here...
}
```


# Contribute

All contributions are welcome. Submit your PRs!

## Get project

* `git clone` this repository
* `npm install`
* `bower install`

## Running Tests

* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
