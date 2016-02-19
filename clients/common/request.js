import axios from 'axios';
import ApplicationStore from './stores/ApplicationStore';

// Request interceptor
axios.interceptors.request.use(function (config) {
  config.responseType = 'json';
  if (config.method !== 'GET' && config.method !== 'HEAD') {
    if (ApplicationStore.getState().csrf) {
      config.headers['x-csrf-token'] = ApplicationStore.getState().csrf;
    }
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
  }
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// Response interceptor
axios.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  return Promise.reject(error);
});

module.exports = axios;
