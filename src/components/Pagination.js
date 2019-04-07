import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';
import get from 'lodash/get';
import { translate, Trans } from 'react-i18next';

import { fetchLastfmProfileHistory } from 'store/actions/userActions';

class Pagination extends React.Component {
  state = {
    page: 1
  }

  navigateToPage = (page) => {
    this.setState({page}, () => {
      this.props.fetchLastfmProfileHistory(this.props.userToDisplay, {page: this.state.page})
    })
  };

  nextPage = () => {
    const page = this.state.page + 1
    this.navigateToPage(page)
  };

  prevPage = () => {
    const page = this.state.page - 1
    this.navigateToPage(page)
  };

  render () {
    const totalPages = get(this.props.user, `profiles['${this.props.userToDisplay}'].totalPages`, '')

    return (
      <div className="d-flex justify-content-between m-2">
        <Button  size="sm" onClick={this.prevPage} disabled={this.state.page <= 1}>
          <Trans i18nKey="previous">Previous</Trans>
        </Button>
        <Button size="sm" onClick={this.nextPage} disabled={this.state.page === totalPages}>
          <Trans i18nKey="next">Next</Trans>
        </Button>
      </div>
    )
  }
}


Pagination.propTypes = {
  totalPages: PropTypes.string,
  fetchLastfmProfileHistory: PropTypes.func,
  user: PropTypes.object,
  userToDisplay: PropTypes.string,
};

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
  fetchLastfmProfileHistory: fetchLastfmProfileHistory(dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(
  translate(['common'])(Pagination)
);
