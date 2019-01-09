[![Build Status](https://travis-ci.org/carlosrberto/reduxed.svg?branch=master)](https://travis-ci.org/carlosrberto/reduxed)
[![Coverage Status](https://img.shields.io/coveralls/github/carlosrberto/reduxed.svg)](https://coveralls.io/github/carlosrberto/reduxed?branch=master)
![](https://img.shields.io/npm/v/reduxed.svg)
[![Maintainability](https://api.codeclimate.com/v1/badges/c8fd083ed221786de7cc/maintainability)](https://codeclimate.com/github/carlosrberto/reduxed/maintainability)

:warning: **Warning** :warning:

This project is not intended to production use yet. I'm still working on it.

# Reduxed

Reduxed is a [Redux](https://redux.js.org) helper library for creating type constants, actions, reducers and more without all Redux boilerplate.

## Why?

Because Redux has a lot of boilerplate and we always see ourselves doing repetitive tasks like:

- Creating action type constants
- Creating action creators
- Creating reducers with lots of `switch` `case` statements
- Splitting all these things in many files (actions.js, types.js, reducer.js, constants.js, etc...)

Or sometimes we need a way to [reuse reducers logic](https://redux.js.org/recipes/structuring-reducers/reusing-reducer-logic) and Redux don't provides a native way to do this.

Reduxed solves the above problems.

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

const initialState = 0;

// reducer
export const reducer = (state = initialState, action) => {
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
import { create, handler, getActions, getReducer, getTypes } from "reduxed";

const initialState = 0;
const options = { typePrefix: "app/counter" };

const counter = create(
  handler("increment", (state, payload = 1) => state + payload),
  handler("decrement", (state, payload = 1) => state - payload)
)(initialState, options); // options are optional

export const reducer = getReducer(counter);
export const actions = getActions(counter);
export const types = getActions(counter);
```

Then you can use your reducer, actions and types like you normally do.

### Explaining
**`getReducer`** will return a Redux like reducer function that accepts a state and action as arguments:

```js
reducer(1, { type: 'app/counter/INCREMENT' }) // 2
```

**`getActions`** will return an object like the following:

```js
{
  increment: payload => ({ type: 'app/counter/INCREMENT', payload }),
  decrement: payload => ({ type: 'app/counter/DECREMENT', payload }),
}
```

**`getTypes`** will return an object like the following:

```js
{
  increment: 'app/counter/INCREMENT',
  decrement: 'app/counter/DECREMENT',
}
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

In your components:

```jsx
const Counters = () => (
  <div>
    <Counter scope="A" />
    <Counter scope="B" />
    <Counter scope="C" />
  </div>
);
```

## Try it

Simple counter:

[![Edit Reduxed - Simple Counter](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/xjnx083yz4)


Multiple counters with scope:

[![Edit Reduxed -  Counter with scope](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/ql6m73jwn9)
