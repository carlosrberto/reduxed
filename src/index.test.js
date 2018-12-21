import { create, handler } from './index';

describe('create', () => {
  const fn1 = () => {};
  const fn2 = () => {};
  const name1 = 'name1';
  const name2 = 'name2';

  const args = [
    handler(name1, fn1),
    handler(name2, fn2),
  ];

  const initialState = {};
  const options = {
    typePrefix: 'app/foo/',
  };

  const created = create(...args)(initialState, options);

  it('should return an object with `handlers` key', () => {
    expect(created.handlers).toEqual(args);
  });

  it('should return an object with `handlersByType` key', () => {
    expect(created.handlersByType).toEqual({
      [`${options.typePrefix}${name1}`]: fn1,
      [`${options.typePrefix}${name2}`]: fn2,
    });
  });

  it('should return an object with `initialState` key', () => {
    expect(created.initialState).toEqual(initialState);
  });

  it('should return an object with `options` key', () => {
    expect(created.options).toEqual(options);
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
