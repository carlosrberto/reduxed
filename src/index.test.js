import {
  create,
  handler,
  getTypes,
  getReducer,
  getActions,
  actionScope,
  reducerScope,
  withScope,
} from './index'

describe('create', () => {
  const fn1 = () => {}
  const fn2 = () => {}
  const args = [handler('fooAction', fn1), handler('barAction', fn2)]
  const initialState = {}
  const options = {
    typePrefix: 'app/foo',
  }

  const created = create(...args)(initialState, options)

  it('should return an object with `handlers` key', () => {
    expect(created.handlers).toEqual(args)
  })

  it('should return an object with `handlersByType` key', () => {
    expect(created.handlersByType).toEqual({
      'app/foo/FOO_ACTION': fn1,
      'app/foo/BAR_ACTION': fn2,
    })
  })

  it('should return an object with `initialState` key', () => {
    expect(created.initialState).toEqual({})
  })

  it('should return an object with `options` key', () => {
    expect(created.options).toEqual({
      typePrefix: 'app/foo',
    })
  })
})

describe('handler', () => {
  const name = 'foo'
  const fn = () => {}
  const handlerObject = handler(name, fn)

  it('should return an object with a `name` key', () => {
    expect(handlerObject.name).toEqual(name)
  })

  it('should return an object with a `fn` key', () => {
    expect(handlerObject.fn).toEqual(fn)
  })
})

describe('getTypes', () => {
  const created = create(
    handler('anotherFooAction', () => {}),
    handler('oneMoreBarAction', () => {})
  )(0, { typePrefix: 'app' })

  const types = getTypes(created)

  it('should return an object with all action types', () => {
    expect(types.anotherFooAction).toEqual('app/ANOTHER_FOO_ACTION')
    expect(types.oneMoreBarAction).toEqual('app/ONE_MORE_BAR_ACTION')
  })
})

describe('getActions', () => {
  const created = create(
    handler('increment', (state, payload = 1) => state + payload)
  )(0, { typePrefix: 'app' })

  const actions = getActions(created)

  it('should return an object with all action creators', () => {
    expect(actions.increment).toBeInstanceOf(Function)
  })

  it('should return action argument as payload', () => {
    expect(actions.increment(2)).toEqual({
      type: 'app/INCREMENT',
      payload: 2,
    })
  })

  it('should return undefined payload when action arguments are undefined', () => {
    expect(actions.increment()).toEqual({
      type: 'app/INCREMENT',
    })
  })
})

const runCounterReducerTests = (reducer, actions) => {
  describe('generated reducer', () => {
    it('should return a function', () => {
      expect(reducer).toBeInstanceOf(Function)
    })

    it('should be a function with 2 arguments', () => {
      expect(reducer.length).toEqual(2)
    })

    it('should return the initial state when using undefined state and invalid action type', () => {
      expect(reducer(undefined, {})).toEqual(0)
    })

    it('should return the provided state with invalid action type', () => {
      expect(reducer(1, {})).toEqual(1)
    })

    it('should accept an initial state', () => {
      expect(reducer(2, actions.increment())).toEqual(3)
      expect(reducer(2, actions.decrement())).toEqual(1)
    })

    it('should work as expected when an action is provided', () => {
      expect(reducer(undefined, actions.increment())).toEqual(1)
      expect(reducer(undefined, actions.decrement())).toEqual(-1)
    })

    it('should work as expected when an action with payload is provided', () => {
      expect(reducer(1, actions.increment(10))).toEqual(11)
    })
  })
}

describe('getReducer', () => {
  const created = create(
    handler('increment', (state, payload = 1) => state + payload),
    handler('decrement', (state, payload = 1) => state - payload)
  )(0)

  const actions = getActions(created)
  const reducer = getReducer(created)

  runCounterReducerTests(reducer, actions)
})

const setupScope = () => {
  const actions = {
    increment: (payload = 1) => ({ type: 'INCREMENT', payload }),
    decrement: (payload = 1) => ({ type: 'DECREMENT', payload }),
  }

  const reducer = (state = 0, action) => {
    switch (action.type) {
      case 'INCREMENT':
        return state + action.payload
      case 'DECREMENT':
        return state - action.payload
      default:
        return state
    }
  }

  const scopedActions = actionScope('counter-1', actions)
  const scopedReducer = reducerScope('counter-1', reducer)

  return {
    actions,
    reducer,
    scopedActions,
    scopedReducer,
  }
}

describe('actionScope', () => {
  const { scopedActions } = setupScope()
  it('should add an property `reduxed-scope` in all actions', () => {
    expect(scopedActions.increment()).toHaveProperty('reduxed-scope')
    expect(scopedActions.decrement()).toHaveProperty('reduxed-scope')
  })

  it('should not enumerate `reduxed-scope` property', () => {
    expect(scopedActions.increment(1)).toEqual({
      type: 'INCREMENT',
      payload: 1,
    })
    expect(scopedActions.decrement(2)).toEqual({
      type: 'DECREMENT',
      payload: 2,
    })
  })

  it('should have a property `reduxed-scope` with the passed scope', () => {
    expect(scopedActions.increment()['reduxed-scope']).toEqual('counter-1')
    expect(scopedActions.decrement()['reduxed-scope']).toEqual('counter-1')
  })
})

describe('reducerScope', () => {
  const { scopedActions, scopedReducer, actions } = setupScope()

  it('should return the initial state when state is undefined and actions without scope are provided', () => {
    expect(scopedReducer(undefined, actions.increment())).toEqual(0)
  })

  it('should return the provided state when actions without scope are provided', () => {
    expect(scopedReducer(3, actions.increment())).toEqual(3)
  })

  runCounterReducerTests(scopedReducer, scopedActions)
})

describe('withScope', () => {
  const { actions, reducer } = setupScope()

  it('should return a function when no target is provided', () => {
    const firstCounterScope = withScope('counter-1')
    expect(firstCounterScope).toBeInstanceOf(Function)
    expect(firstCounterScope(actions)).toBeInstanceOf(Object)
  })

  it('should return an object with actions when an object with actions is provided', () => {
    const scopedActions = withScope('counter-1', actions)
    expect(scopedActions).toBeInstanceOf(Object)
  })

  it('should return a new reducer function when a reducer is provided', () => {
    const scopedActions = withScope('counter-1', reducer)
    expect(scopedActions).toBeInstanceOf(Function)
  })

  it('should throw when target is invalid', () => {
    expect(() => withScope('counter-1', null)).toThrow()
  })
})
