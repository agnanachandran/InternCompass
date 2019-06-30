import { post } from '../utils/ajaxCamelCase';

export function submitFeedback(feedback) {
  return dispatch => {
    const { name, email, comment } = feedback;
    return post('/feedback', { name, email, comment });
  };
}

