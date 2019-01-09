export const toSnakeCase = value =>
  value
    .replace(/([^A-Z_])([A-Z])/g, '$1_$2')
    .replace(/\s/g, '');

export const getActionType = (prefix, name) => {
  const before = prefix ? `${prefix}/` : '';
  return `${before}${toSnakeCase(name).toUpperCase()}`;
};

export const isObject = value =>
  !!value && value.constructor === Object;

export const isFunction = value =>
  typeof value === 'function';
