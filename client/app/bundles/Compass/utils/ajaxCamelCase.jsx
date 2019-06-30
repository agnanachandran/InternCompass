import $ from 'jquery';
import { camelize, decamelize } from './deepCamelCase';

function camelizeResponse(resp) {
  return camelize(resp);
}

function wrapSuccessHandler(success) {
  if (success) {
    return function(resp) {
      success(camelize(resp));
    };
  }
  return camelizeResponse;
}

export function get(url, data, success, error) {
  const successHandler = wrapSuccessHandler(success);
  return $.get(url, decamelize(data)).then(successHandler).fail(data => {
    if (error) {
      error();
    }
  });
}

export function post(url, data, success) {
  const successHandler = wrapSuccessHandler(success);
  return $.post(url, decamelize(data), 'json').then(successHandler);
}

export function put(url, data) {
  return $.ajax({
    url,
    type: 'PUT',
    data: decamelize(data),
  }).then(camelizeResponse);
}

export function del(url, data) {
  return $.ajax({
    url,
    type: 'DELETE',
    data: decamelize(data),
  }).then(camelizeResponse);
}