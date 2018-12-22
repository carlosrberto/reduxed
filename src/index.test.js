import { create, handler, getTypes, getActions } from './index';

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
  });
});
