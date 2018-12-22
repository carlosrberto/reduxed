export const toSnakeCase = str =>
  str.replace(/([A-Z])+/g, '_$1').toUpperCase();

export const getActionType = (prefix, name) =>
  `${prefix}/${toSnakeCase(name)}`;

export const isObject = value =>
  !!value && value.constructor === Object;

export const isFunction = value =>
  typeof value === 'function';
