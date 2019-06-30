import moment from 'moment';

// Formats an ISO 8601 UTC date string
// e.g.
// '2016-08-11T22:34:29.079Z' -> 'August 11th 2016'
export function formatDate(dateString) {
  return moment(dateString).format('MMMM Do, YYYY');
}

// Formats an ISO 8601 UTC date string using Moment.js's fromNow method
// TODO handle years or display a string depending on the current time (e.g. 'an hour ago', 'just now')
// e.g.
// '2016-08-11T22:34:29.079Z' -> 'August 11th 10:34 pm'
export function formatDateWithTime(dateString) {
  return moment(dateString).format('MMM Do h:mm a');
}

export function formatWebsiteUrl(websiteUrl) {
  let matches = websiteUrl.match(/^(?:(ftp|http|https):\/\/)?(?:www\.)?(.+)$/);
  if (!matches) {
    return websiteUrl;
  }
  let formattedUrl = matches.pop();
  if (formattedUrl[formattedUrl.length-1] === '/') {
    formattedUrl = formattedUrl.slice(0, -1);
  }
  return formattedUrl;
}
