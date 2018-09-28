import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

class PrivateRoute extends React.Component {
  render() {
    if (this.props.user.isLoggedIn) {
      return <Route {...this.props} />
    } else if (this.props.user.isLoggedIn === false) {
      return <Redirect to="/" />
    } else {
      return null;
    }
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  }
};

const mapDispatchToProps = () => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(PrivateRoute);
