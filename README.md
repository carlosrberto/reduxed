[![Build Status](https://travis-ci.org/carlosrberto/reduxed.svg?branch=master)](https://travis-ci.org/carlosrberto/reduxed)
[![Coverage Status](https://coveralls.io/repos/github/carlosrberto/reduxed/badge.svg?branch=master)](https://coveralls.io/github/carlosrberto/reduxed?branch=master)
[![npm version](https://badge.fury.io/js/reduxed.svg)](https://badge.fury.io/js/reduxed)
[![Maintainability](https://api.codeclimate.com/v1/badges/c8fd083ed221786de7cc/maintainability)](https://codeclimate.com/github/carlosrberto/reduxed/maintainability)

:warning: **Warning** :warning:

This project is not intended to production use yet. I'm still working on it.

# Reduxed

Reduxed is a [Redux](https://redux.js.org) helper library for creating type constants, actions and reducers and more without all Redux boilerplate.

## Why?

Because Redux has a lot of boilerplate and we always see ourselves doing repetitive tasks like:

- Creating action type constants
- Creating action creators
- Creating reducers with lots of `switch` `case` statements
- Splitting all this in many files (actions.js, types.js, reducer.js, constants.js, etc...)

Or sometimes we need a way to [reuse reducers logic](https://redux.js.org/recipes/structuring-reducers/reusing-reducer-logic) and Redux don't provides a native way to do this.

## Installation
```sh
npm install --save reduxed
```

## Getting started

Let's see an example **without** Reduxed.

```javascript
// types
export const INCREMENT = 'app/counter/increment';
export const DECREMENT = 'app/counter/decrement';

// action creators
export const increment = (value = 1) => ({ type: INCREMENT, payload: value });
export const decrement = (value = 1) => ({ type: DECREMENT, payload: value });

// reducer
export const reducer = (state = 0, action) => {
  switch (action.type) {
    case INCREMENT:
      return state + action.payload;

    case DECREMENT:
      return state - action.payload;

    default:
      return state;
  }
}
```

Now let's see the same **using** Reduxed:

```js
import { create, handler, getActions, getReducer, getTypes } from 'reduxed';

const counter = create(
  handler('increment', (state, payload = 1) => state + payload),
  handler('increment', (state, payload = 1) => state - payload),
)(0);

export const reducer = getReducer(counter);
export const actions = getActions(counter);
export const types = getActions(counter);
```

Then you can use your reducer, actions and types like you normally do.

### Explaining
**`getReducer`** will return a Redux like reducer function that accepts a state and action as arguments:

```js
reducer(1, { type: 'INCREMENT' }) // 2
```

**`getActions`** will return an object like the following:

```js
{
  increment: payload => ({ type: 'INCREMENT', payload }),
  decrement: payload => ({ type: 'DECREMENT', payload }),
}
```

**`getTypes`** will return an object like the following:

```js
{
  increment: 'INCREMENT',
  decrement: 'DECREMENT',
}
```

If you want to add a prefix to your action types you can use the `typePrefix` option:

```js
const counter = create(
  handler('increment', (state, payload = 1) => state + payload),
  handler('increment', (state, payload = 1) => state - payload),
)(0, { typePrefix: 'app/counter' });

const types = getTypes(counter)
// {
//  'increment': 'app/counter/INCREMENT',
//  'decrement': 'app/counter/DECREMENT',
// }
```

## Reusing reducer logic
If you need to [reuse reducers logic](https://redux.js.org/recipes/structuring-reducers/reusing-reducer-logic) across your application you can use `withScope` from Reduxed:

```javascript
import { combineReducers } from 'redux';
import { withScope } from 'reduxed';
import { reducer } from './counter';

const rootReducer = combineReducers({
  counterA: withScope('A', reducer),
  counterB: withScope('B', reducer),
  counterC: withScope('C', reducer),
});
```

Then in your mapDispatchToProps you can do something like this:

```js
import { withScope } from 'reduxed';
import { bindActionCreators } from 'redux';
import { actions } from './counter';

const mapDispatchToProps = (dispatch, ownProps) => {
  const scopedActions = withScope(ownProps.scope, actions);
  return bindActionCreators(scopedActions, dispatch);
}
```
