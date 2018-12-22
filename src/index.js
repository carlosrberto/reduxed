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
  (state, action) =>
    (state ? handlersByType[action.type](state, action) : state);

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

export const actionScope = (scope, actions) =>
  Object.keys(actions).reduce((acc, key) => {
    const actionCreator = actions[key];
    const fn = (...args) => {
      const action = actionCreator(...args);
      const meta = action.meta || {};
      return {
        ...action,
        meta: {
          ...meta,
          scope,
        },
      };
    };
    acc[key] = fn;
    return acc;
  }, {});

export const reducerScope = (scope, reducer) => (state, action) => {
  if (action.meta && action.meta.scope === scope) {
    return reducer(state, action);
  }
  return state;
};

export const withScope = (scope, target) => {
  if (typeof target === 'function') {
    return reducerScope(scope, target);
  } if (typeof target === 'object') {
    return actionScope(scope, target);
  }
  throw Error('Invalid scope target. It should be a reducer function or an object containing action creators');
};
