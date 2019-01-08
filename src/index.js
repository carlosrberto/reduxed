import { getActionType, isObject, isFunction } from './helpers';
import { SCOPE_PROPERTY } from './constants';

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

export const getReducer = ({ handlersByType, initialState }) =>
  (state, action) => {
    const nextState = state === undefined ? initialState : state;
    if (isObject(action) && isFunction(handlersByType[action.type])) {
      return handlersByType[action.type](nextState, action.payload);
    }
    return nextState;
  };

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
      const nextAction = Object.defineProperty({ ...action }, SCOPE_PROPERTY, {
        value: scope,
      });
      return nextAction;
    };
    acc[key] = fn;
    return acc;
  }, {});

export const reducerScope = (scope, reducer) => (state, action) => {
  if (action && action[SCOPE_PROPERTY] === scope) {
    return reducer(state, action);
  }
  return reducer(state, {});
};

export const withScope = (scope, target) => {
  if (target !== undefined) {
    if (isFunction(target)) {
      return reducerScope(scope, target);
    } if (isObject(target)) {
      return actionScope(scope, target);
    }
    throw Error('Invalid scope target. It should be a reducer function or an object containing action creators');
  } else {
    return arg => withScope(scope, arg);
  }
};
