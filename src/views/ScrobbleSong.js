import React, { Component } from 'react';
import { connect } from 'react-redux';

import { clearListOfScrobbles } from 'store/actions/scrobbleActions';

import ScrobbleList from 'components/ScrobbleList';
import SongForm from 'components/SongForm';

class ScrobbleSong extends Component {
  render() {
    return (
      <div className="row flex-lg-grow-1">
        <div className="col-md-6 mb-4">
          <SongForm />
        </div>
        <div className="col-md-6 ScrobbleList-container">
          <ScrobbleList
            scrobbles={this.props.userScrobbles}
            clearList={this.props.clearUserList}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userScrobbles: state.scrobbles.list,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    clearUserList: clearListOfScrobbles(dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ScrobbleSong);
