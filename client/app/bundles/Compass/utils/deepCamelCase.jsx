import humps from 'humps';

export function camelize(props) {
  return humps.camelizeKeys(props);
}

export function decamelize(props) {
  return humps.decamelizeKeys(props);
}