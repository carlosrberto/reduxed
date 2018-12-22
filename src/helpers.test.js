import {
  toSnakeCase,
  getActionType,
  isObject,
  isFunction,
} from './helpers';

describe('toSnakeCase', () => {
  it('should convert a camel case string to snake case', () => {
    expect(toSnakeCase('camelCase')).toEqual('camel_Case');
    expect(toSnakeCase('camelCase2')).toEqual('camel_Case2');
    expect(toSnakeCase('camel2Case')).toEqual('camel2_Case');
    expect(toSnakeCase('camel@!Case')).toEqual('camel@!_Case');
    expect(toSnakeCase('camel_Case')).toEqual('camel_Case');
    expect(toSnakeCase('camel_CaseWord')).toEqual('camel_Case_Word');
  });
});

describe('getActionType', () => {
  it('should return the prefix concatenated with name', () => {
    expect(getActionType('foo/bar', 'fooBarAction'))
      .toEqual('foo/bar/FOO_BAR_ACTION');
  });
});

describe('isFunction', () => {
  it('should be truthy when `value` is a function', () => {
    expect(isFunction(() => {})).toBeTruthy();
    expect(() => {}).toBeTruthy();
  });

  it('should be falsy when `value` is not a function', () => {
    expect(isFunction(null)).toBeFalsy();
    expect(isFunction(undefined)).toBeFalsy();
    expect(isFunction(NaN)).toBeFalsy();
    expect(isFunction([])).toBeFalsy();
    expect(isFunction('str')).toBeFalsy();
    expect(isFunction(0)).toBeFalsy();
  });
});

describe('isObject', () => {
  it('should be truthy when `value` is a function', () => {
    expect(isObject({})).toBeTruthy();
  });

  it('should be falsy when `value` is not a function', () => {
    expect(isObject(() => {})).toBeFalsy();
    expect(isObject(null)).toBeFalsy();
    expect(isObject(undefined)).toBeFalsy();
    expect(isObject(NaN)).toBeFalsy();
    expect(isObject([])).toBeFalsy();
    expect(isObject('str')).toBeFalsy();
    expect(isObject(0)).toBeFalsy();
  });
});
