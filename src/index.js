/* @flow */
import { getActionType, isObject, isFunction } from './helpers';
import { SCOPE_PROPERTY } from './constants';

type ActionHandler = (any, any) => any;

type ReduxAction = { type: string, payload: any };

type ReduxReducer = (any, ReduxAction) => any;

type ReduxActionTypes = {
  [string]: string
};

type ReduxActionCreators = { [string]: (any) => ReduxAction };

type Handler = {
  name: string,
  fn: ActionHandler,
};

type Options = {
  typePrefix: string,
}

type ReducerDescriptor = {
  handlers: Array<Handler>,
  handlersByType: { [string]: ActionHandler },
  initialState: any,
  options: Options,
}

export const create = (...handlers: Array<Handler>) =>
  (initialState: any, options: Options = { typePrefix: '' }): ReducerDescriptor => {
    const handlersByType: { [string]: ActionHandler } = handlers.reduce((acc, { name, fn }) => {
      acc[getActionType(options.typePrefix, name)] = fn;
      return acc;
    }, {});
    return ({
      handlers, handlersByType, initialState, options,
    });
  };

export const handler = (
  name: string,
  fn: ActionHandler,
): Handler =>
  ({ name, fn });

export const getReducer = ({ handlersByType, initialState }: ReducerDescriptor): ReduxReducer =>
  (state, action) => {
    const nextState = state === undefined ? initialState : state;
    if (isObject(action) && isFunction(handlersByType[action.type])) {
      return handlersByType[action.type](nextState, action.payload);
    }
    return nextState;
  };

export const getTypes = ({
  handlers,
  options: { typePrefix },
}: ReducerDescriptor): ReduxActionTypes =>
  handlers.reduce((acc, { name }) => {
    acc[name] = getActionType(typePrefix, name);
    return acc;
  }, {});

export const getActions = ({
  handlers,
  options: { typePrefix },
}: ReducerDescriptor): ReduxActionCreators =>
  handlers.reduce((acc, { name }) => {
    acc[name] = payload => ({
      type: getActionType(typePrefix, name),
      payload,
    });
    return acc;
  }, {});

export const actionScope = (
  scope: string,
  actions: ReduxActionCreators,
): ReduxActionCreators =>
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

export const reducerScope = (
  scope: string,
  reducer: ReduxReducer,
): ReduxReducer => (state, action) => {
  if (action && action[SCOPE_PROPERTY] === scope) {
    return reducer(state, action);
  }
  return reducer(state, {});
};

export const withScope = (
  scope: any,
  target: any,
) => {
  if (target !== undefined) {
    if (isFunction(target)) {
      return reducerScope(scope, target);
    } else if (isObject(target)) {
      return actionScope(scope, target);
    }
    throw Error('Invalid scope target. It should be a reducer function or an object containing action creators');
  } else {
    return (arg: any) => withScope(scope, arg);
  }
};
