import React, { Component } from 'react';
import CenteredSpinner from '../../components/CenteredSpinner';
import css from './AdminFeedbackPanelContainer.scss';
import * as adminActions from '../actions/adminActions';
import AdminCard from '../components/AdminCard';
import CardTitle from 'material-ui/Card/CardTitle';
import CardText from 'material-ui/Card/CardText';
import AdminFeedbackListItem from '../components/AdminFeedbackListItem';
import _ from 'lodash';

export default class AdminFeedbackPanelContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
    this.receiveFullPageData = this.receiveFullPageData.bind(this);
  }

  componentDidMount() {
    adminActions.fetchFeedback(this.receiveFullPageData);
  }

  receiveFullPageData(data) {
    this.setState({
      loading: false,
      feedback: data,
    });
  }

  renderFeedback() {
    return _.map(this.state.feedback, (feedback, i) =>
      (
        <AdminFeedbackListItem key={i} {...feedback}/>
      )
    );
  }

  render() {
    if (this.state.loading) {
      return (
        <CenteredSpinner size={1.5} marginTop={'56px'} />
      );
    }
    return (
      <AdminCard>
        <CardTitle title={'Feedback'} className={css.cardHeader} />
        <CardText>
          {this.renderFeedback()}
        </CardText>
      </AdminCard>
    );
  }
}