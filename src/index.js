import { getActionType } from './helpers';

export const create = (...handlers) =>
  (initialState, options = { typePrefix: '' }) => {
    const handlersByType = handlers.reduce((acc, { name, fn }) => {
      acc[getActionType(options.typePrefix, name)] = fn;
      return acc;
    }, {});
    return ({
      handlers, handlersByType, initialState, options,
    });
  };

export const handler = (name, fn) =>
  ({ name, fn });

export const getReducer = ({ handlersByType }) =>
  (initialState, action) =>
    (initialState ? handlersByType[action.type](initialState, action) : initialState);

export const getTypes = ({ handlers, options: { typePrefix } }) =>
  handlers.reduce((acc, { name }) => {
    acc[name] = getActionType(typePrefix, name);
    return acc;
  }, {});

export const getActions = ({ handlers, options: { typePrefix } }) =>
  handlers.reduce((acc, { name }) => {
    acc[name] = payload => ({
      type: getActionType(typePrefix, name),
      payload,
    });
    return acc;
  }, {});
