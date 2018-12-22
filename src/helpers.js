export const toSnakeCase = value =>
  value
    .replace(/([^A-Z_])([A-Z])/g, '$1_$2')
    .replace(/\s/g, '');

export const getActionType = (prefix, name) =>
  `${prefix}/${toSnakeCase(name).toUpperCase()}`;

export const isObject = value =>
  !!value && value.constructor === Object;

export const isFunction = value =>
  typeof value === 'function';
