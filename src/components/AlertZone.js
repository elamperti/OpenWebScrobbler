import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Trans } from 'react-i18next';

import {
  Alert,
} from 'reactstrap';

import { dismissAlert, clearAlerts } from 'store/actions/alertActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class AlertZone extends React.Component {
  constructor(props) {
    super(props);

    this.toggleAlert = this.toggleAlert.bind(this);

    this.state = {
      isOpen: {},
    };

    for (let individualAlert of this.props.alerts) {
      this.state.isOpen[individualAlert.id] = true;
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.props.clearAlerts();
    }
  }

  toggleAlert(alertId) {
    this.setState({
      isOpen: {
        ...this.state.isOpen,
        [alertId]: false,
      },
    }, () => {
      setTimeout(() => this.props.dismissAlert({ id: alertId }), 1000);
    });
  }

  render() {
    let alerts = [];

    for (let individualAlert of this.props.alerts) {
      alerts.push(
        <Alert
          isOpen={this.state.isOpen[individualAlert.id]}
          fade={false}
          color={individualAlert.type}
          key={individualAlert.id}
          toggle={() => this.toggleAlert(individualAlert.id)}
        >
          <div className="d-flex">
            { !individualAlert.icon ? null : (
              <div className="mr-4">
                <FontAwesomeIcon size={ individualAlert.title ? '3x' : null } icon={individualAlert.icon} />
              </div>
            ) }
            <div>
              { individualAlert.title ? <span><strong><Trans i18nKey={individualAlert.title} /></strong><br /></span> : null }
              { individualAlert.errorNumber ? `(${individualAlert.errorNumber}) ` : null }
              { individualAlert.rawMessage || <Trans i18nKey={individualAlert.message} /> }
            </div>
          </div>
        </Alert>
      );
    }

    return alerts.length > 0 ? (
      <div className="AlertZone mt-3">
        {alerts}
      </div>
    ) : null;
  }
}

const mapStateToProps = (state) => {
  return {
    alerts: state.alerts,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    dismissAlert: dismissAlert(dispatch),
    clearAlerts: () => dispatch(clearAlerts()),
  };
}

AlertZone.propTypes = {
  alerts: PropTypes.array,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  clearAlerts: PropTypes.func,
  dismissAlert: PropTypes.func,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AlertZone));
