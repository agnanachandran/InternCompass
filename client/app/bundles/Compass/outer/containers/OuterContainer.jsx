import PropTypes from 'prop-types';
import React from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import OuterWidget from '../components/OuterWidget';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { connect } from 'react-redux';

const muiTheme = getMuiTheme({
  userAgent: false,
  zIndex: {
    layer: 10,
    popover: 11,
  }
});

injectTapEventPlugin();

class OuterContainer extends React.Component {
  static propTypes = {
    currentUser: PropTypes.object,
    children: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    snackbarMessage: PropTypes.string,
  };

  constructor(props) {
    super(props);
    const prepareStyles = muiTheme.prepareStyles;

    muiTheme.prepareStyles = style => {
      style = prepareStyles(style);
      if (typeof style.display === 'object') {
        style.display = style.display.join(';display:');
      }
      return style;
    };
  }

  render() {
    const { children, dispatch, currentUser, snackbarMessage } = this.props;
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <OuterWidget
          children={children}
          dispatch={dispatch}
          currentUser={currentUser}
          snackbarMessage={snackbarMessage}
        />
      </MuiThemeProvider>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentUser: state.compassStore.currentUser,
    snackbarMessage: state.compassStore.outerMessage,
  };
}

export default connect(mapStateToProps)(OuterContainer);
