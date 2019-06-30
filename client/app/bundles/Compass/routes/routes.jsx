import React from 'react';
import { IndexRoute, Route } from 'react-router';
import { setRedirectAction } from '../actions/redirectActions';

import OuterContainer from '../outer/containers/OuterContainer';
import ContentContainer from '../outer/containers/ContentContainer';
// import WideContentContainer from '../outer/containers/WideContentContainer';
import HomeContainer from '../home/containers/HomeContainer';
import UserProfileContainer from '../user/containers/UserProfileContainer';
import UserSettingsContainer from '../user/containers/UserSettingsContainer';
import UserSignupContainer from '../user/containers/UserSignupContainer';
import UserSigninContainer from '../user/containers/UserSigninContainer';
import PasswordResetContainer from '../user/containers/PasswordResetContainer';
import ChangePasswordContainer from '../user/containers/ChangePasswordContainer';
import CompanyContainer from '../company/company_show/CompanyContainer';
import CritiquesContainer from '../critique/containers/CritiquesContainer';
import CritiqueContainer from '../critique/containers/CritiqueContainer';
import UploadCritiqueableFormContainer from '../critique/containers/UploadCritiqueableFormContainer';
import NotFoundComponent from '../errors/components/NotFoundComponent';
// import InterviewQuestionListContainer from '../interview_question/interview_question_list/InterviewQuestionListContainer';
// import InterviewQuestionShowContainer from '../interview_question/interview_question_show/InterviewQuestionShowContainer';
import WriteReviewContainer from '../review/containers/WriteReviewContainer';
import SearchResultsContainer from '../search/containers/SearchResultsContainer';
import ReviewContainer from '../review/containers/ReviewContainer';
import AdminContainer from '../admin/AdminContainer';
import AdminContentSummary from '../admin/content_summary/AdminContentSummary';
import AdminUsersPanelContainer from '../admin/content_users/AdminUsersPanelContainer';
import AdminUserReviewsPanelContainer from '../admin/content_user_reviews/AdminUserReviewsPanelContainer';
import AdminCompaniesPanelContainer from '../admin/content_companies/AdminCompaniesPanelContainer';
import AdminEditCompanyContainer from '../admin/content_companies/AdminEditCompanyContainer';
import AdminFeedbackPanelContainer from '../admin/content_feedback/AdminFeedbackPanelContainer';
import TermsOfUseContainer from '../terms_of_use/containers/TermsOfUseContainer';

if (!SERVER_RENDER) {
  /*global SERVER_RENDER*/
  const GoogleMapsLoader = require('google-maps');
  GoogleMapsLoader.KEY = 'KEY_HERE';
  GoogleMapsLoader.LIBRARIES = ['places'];
}

export default (store) => {
  // To redirect after logging in, add a function below, and add an `onEnter=<function>` prop for the route below
  // You will also need to modify omniauth_callbacks_controller.rb
  const authRequiredWriteReview = (nextState, replace) => {
    const state = store.getState();
    if (!state.compassStore.currentUser) {
      const prefilledCompany = state.review.createReview.prefilledCompany;
      store.dispatch(setRedirectAction(`/write-review?company=${prefilledCompany}`));
      const linkParams = prefilledCompany ? `&company=${prefilledCompany}` : '';
      replace(`/login?from=write_review${linkParams}`);
    }
  };

  const authRequiredUploadResume = (nextState, replace) => {
    const state = store.getState();
    if (!state.compassStore.currentUser) {
      store.dispatch(setRedirectAction('/critiques/upload'));
      replace('/login?from=critiques_upload');
    }
  };

  const adminRequired = (nextState, replace) => {
    const state = store.getState();
    if (!state.compassStore.currentUser || !state.compassStore.currentUser.admin) {
      replace('/login');
    }
  };

  return (
    <Route path='/' component={OuterContainer}>
      <IndexRoute component={HomeContainer} />
      <Route path='login' component={UserSigninContainer} />
      <Route path='signup' component={UserSignupContainer} />
      <Route path='forgot_password' component={PasswordResetContainer} />
      <Route path='change_password' component={ChangePasswordContainer} />

      <Route path='write-review' component={WriteReviewContainer} onEnter={authRequiredWriteReview} />

      <Route path='companies/:companySlug' component={CompanyContainer} />

      <Route path='users/update-profile' component={UserSettingsContainer} />
      <Route path='users/:token' component={UserProfileContainer} />

      <Route path='search' component={SearchResultsContainer} />
      <Route component={ContentContainer}>
        <Route path='user_reviews/:token' component={ReviewContainer} />
        <Route path='terms-of-use' component={TermsOfUseContainer} />
      </Route>

      <Route path='admin' component={AdminContainer} onEnter={adminRequired}>
        <IndexRoute component={AdminContentSummary} />
        <Route path='feedback' component={AdminFeedbackPanelContainer} />
        <Route path='users' component={AdminUsersPanelContainer} />
        <Route path='user_reviews' component={AdminUserReviewsPanelContainer} />
        <Route path='companies' component={AdminCompaniesPanelContainer} />
        <Route path='companies/edit/:slug' component={AdminEditCompanyContainer} />
      </Route>

      <Route path='critiques'>
        <IndexRoute component={CritiquesContainer} />
        <Route path='page/:page' component={CritiquesContainer} />
        <Route path='upload' component={UploadCritiqueableFormContainer} onEnter={authRequiredUploadResume} />
        <Route path=':critiqueToken' component={CritiqueContainer} />
      </Route>


      {/* <Route path='interview_questions'>
        <Route component={WideContentContainer}>
          <IndexRoute component={InterviewQuestionListContainer} />
        </Route>
        <Route component={ContentContainer}>
            <Route path=':interviewQuestionId' component={InterviewQuestionShowContainer} />
        </Route>
      </Route> */}
      <Route path='*' component={NotFoundComponent}/>
    </Route>
  );
};
