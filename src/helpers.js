export const toSnakeCase = str =>
  str.replace(/([A-Z])+/g, '_$1').toUpperCase();

export const getActionType = (prefix, name) =>
  `${prefix}/${toSnakeCase(name)}`;
