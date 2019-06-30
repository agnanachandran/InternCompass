import { actionTypes } from '../constants/compassConstants';
import _ from 'lodash';

export const initialState = {
  job: null,
};

export default function jobReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.RECEIVE_JOB:
      return _.assign({}, state, {
        job: action.job,
      });
    default:
      return state;
  }
}
