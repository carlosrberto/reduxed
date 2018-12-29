import {
  create,
  handler,
  getTypes,
  getActions,
  actionScope,
  reducerScope,
  withScope,
} from './index';

describe('create', () => {
  const fn1 = () => {};
  const fn2 = () => {};
  const args = [
    handler('fooAction', fn1),
    handler('barAction', fn2),
  ];
  const initialState = {};
  const options = {
    typePrefix: 'app/foo',
  };

  const created = create(...args)(initialState, options);

  it('should return an object with `handlers` key', () => {
    expect(created.handlers).toEqual(args);
  });

  it('should return an object with `handlersByType` key', () => {
    expect(created.handlersByType).toEqual({
      'app/foo/FOO_ACTION': fn1,
      'app/foo/BAR_ACTION': fn2,
    });
  });

  it('should return an object with `initialState` key', () => {
    expect(created.initialState).toEqual({});
  });

  it('should return an object with `options` key', () => {
    expect(created.options).toEqual({
      typePrefix: 'app/foo',
    });
  });
});

describe('handler', () => {
  const name = 'foo';
  const fn = () => {};
  const handlerObject = handler(name, fn);

  it('should return an object with a `name` key', () => {
    expect(handlerObject.name).toEqual(name);
  });

  it('should return an object with a `fn` key', () => {
    expect(handlerObject.fn).toEqual(fn);
  });
});

describe('getTypes', () => {
  const created = create(
    handler('anotherFooAction', () => {}),
    handler('oneMoreBarAction', () => {}),
  )(0, { typePrefix: 'app' });

  const types = getTypes(created);

  it('should return an object with all action types', () => {
    expect(types.anotherFooAction).toEqual('app/ANOTHER_FOO_ACTION');
    expect(types.oneMoreBarAction).toEqual('app/ONE_MORE_BAR_ACTION');
  });
});

describe('getActions', () => {
  const fn = () => {};
  const created = create(handler('foo', fn))(0, { typePrefix: 'app' });

  const actions = getActions(created);

  it('should return an object with all action creators', () => {
    expect(actions.foo).toBeInstanceOf(Function);
    expect(actions.foo('value')).toEqual({
      type: 'app/FOO',
      payload: 'value',
    });
  });
});

const setupScope = () => {
  const actions = {
    increment: () => ({ type: 'INCREMENT' }),
    decrement: () => ({ type: 'DECREMENT' }),
  };

  const reducer = (state = 0, action) => {
    switch (action.type) {
      case 'INCREMENT':
        return state + 1;
      case 'DECREMENT':
        return state - 1;
      default:
        return state;
    }
  };

  const scopedActions = actionScope('counter-1', actions);
  const scopedReducer = reducerScope('counter-1', reducer);

  return {
    actions,
    reducer,
    scopedActions,
    scopedReducer,
  };
};

describe('actionScope', () => {
  const { scopedActions } = setupScope();
  it('should add an property `reduxed-scope` in all actions', () => {
    expect(scopedActions.increment()).toHaveProperty('reduxed-scope');
    expect(scopedActions.decrement()).toHaveProperty('reduxed-scope');
  });

  it('should not enumerate `reduxed-scope` property', () => {
    expect(scopedActions.increment()).toEqual({ type: 'INCREMENT' });
    expect(scopedActions.decrement()).toEqual({ type: 'DECREMENT' });
  });

  it('should have a property `reduxed-scope` with the passed scope', () => {
    expect(scopedActions.increment()['reduxed-scope']).toEqual('counter-1');
    expect(scopedActions.decrement()['reduxed-scope']).toEqual('counter-1');
  });
});

describe('reducerScope', () => {
  const {
    scopedActions,
    scopedReducer,
    actions,
  } = setupScope();

  it('should return the initial state when no action was provided', () => {
    expect(scopedReducer(undefined, {})).toEqual(0);
  });

  it('should return the initial state with actions without scope', () => {
    expect(scopedReducer(undefined, actions.increment())).toEqual(0);
  });

  it('should apply action if the scope is the same from reducer', () => {
    expect(scopedReducer(0, scopedActions.increment())).toEqual(1);
    expect(scopedReducer(0, scopedActions.decrement())).toEqual(-1);
  });
});

describe('withScope', () => {
  const { actions } = setupScope();

  it('should return a function when no target is provided', () => {
    const firstCounterScope = withScope('counter-1');
    expect(firstCounterScope).toBeInstanceOf(Function);
  });

  it('should return an object with actions when an object with actions is provided', () => {
    const scopedActions = withScope('counter-1', actions);
    expect(scopedActions).toBeInstanceOf(Object);
  });
});
