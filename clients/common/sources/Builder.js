import request from '../request';
import _debugger from '../debugger';
import {merge, enumerate} from '../Helpers';

function generateMethod(name, definition, sourceBase) {
  let methodDefinition = {
    local: function local() { return null; },
    success: null,
    error: sourceBase.actions.error,
    loading: sourceBase.actions.base[name]
  };

  if (!definition.actions || !definition.actions.success) {
    throw new Error(`no actions.success defined for ${name} -method`);
  }

  ['success', 'loading', 'error'].forEach((key) => {
    if (definition.actions[key]) {
      methodDefinition[key] = definition.actions[key];
    }
  });

  let remoteDefinition = merge({}, {
    method: 'get',
    response: {
      key: 'items'
    }
  }, definition.remote || {});

  remoteDefinition.response = definition.remote.response;

  if (typeof definition.remote.response === 'function') {
    remoteDefinition.response = definition.remote.response;
  }

  if (!remoteDefinition.uri) {
    throw new Error(`no uri defined for ${name} -method`);
  }

  methodDefinition.remote = function(state, ...args) {
    let uri = remoteDefinition.uri;
    if (typeof uri === 'function') {
      uri = remoteDefinition.uri(state, args);
    }
    this.debug(`${name} uri: ${uri}`);

    let params = {};
    if (remoteDefinition.params) {
      params = remoteDefinition.params;
      if (typeof params === 'function') {
        params = params(state, args);
      }
    }

    return request[remoteDefinition.method](uri, params)
    .then((response) => {
      this.debug(`${name} success response:`, response);

      if (!response.data) {
        return Promise.reject(new Error('invalid response'));
      }

      if (typeof remoteDefinition.response === 'function') {
        return remoteDefinition.response(state, response, args);
      }

      let responseKey = remoteDefinition.response.key;
      let resolveData = response.data;
      if (responseKey) {
        resolveData = response.data[responseKey];
      }

      if (!resolveData) {
        return Promise.reject(new Error('invalid response'));
      }

      return Promise.resolve(resolveData);
    })
    .catch((response) => {
      this.debug(`${name} error response:`, response);
      if (response instanceof Error) {
        return Promise.reject(response);
      } else {
        let msg = 'unexpected error';
        if (response.data && response.data.error) {
          msg = response.data.error;
        }
        return Promise.reject(new Error(msg));
      }
      return Promise.reject(response);
    });
  }.bind(sourceBase);

  if (typeof definition.local === 'function') {
    methodDefinition.local = definition.local;
  }

  return function() {
    return methodDefinition;
  };
}

export default {
  build: function BuildSource(structure) {
    if (!structure.name) {
      throw new Error('no name defined for Source');
    }
    if (!structure.actions || !structure.actions.base) {
      throw new Error('no actions.base defined for Source');
    }

    structure.methods = structure.methods || [];

    let debug = _debugger(structure.name);

    if (!structure.actions.error) {
      structure.actions.error = structure.actions.base.requestFailed;
    }

    let base = {
      debug: debug,
      actions: structure.actions
    };

    let source = {};

    for (let [name, definition] of enumerate(structure.methods)) {
      source[name] = generateMethod(name, definition, base);
    }

    return source;
  }
};
