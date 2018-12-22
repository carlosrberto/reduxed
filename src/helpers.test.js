import { toSnakeCase, getActionType } from './helpers';

describe('toSnakeCase', () => {
  it('should convert a camel case string to snake case', () => {
    expect(toSnakeCase('camelCaseWord'))
      .toEqual('CAMEL_CASE_WORD');
  });
});

describe('getActionType', () => {
  it('should return the prefix concatenated with name', () => {
    expect(getActionType('foo/bar', 'fooBarAction'))
      .toEqual('foo/bar/FOO_BAR_ACTION');
  });
});
