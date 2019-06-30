import { actionTypes } from '../../constants/compassConstants';
import { get } from '../../utils/ajaxCamelCase';

function receiveJob(job) {
  return {
    type: actionTypes.RECEIVE_JOB,
    job,
  };
}

export function fetchJob(companySlug, jobSlug) {
  return dispatch => {
    return get(`/jobs/${companySlug}/${jobSlug}.json`).done(data => {
      dispatch(receiveJob(data.job.job));
    });
  };
}