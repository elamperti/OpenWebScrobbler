import React, { Component } from 'react';
// import {} from 'reactstrap';
// import FontAwesomeIcon from '@fortawesome/react-fontawesome';
// import faHeadphones from '@fortawesome/fontawesome-free-solid/faHeadphones';

import ScrobbleList from 'components/ScrobbleList';
import SongForm from 'components/SongForm';

export default class ScrobbleSong extends Component {
  render() {
    return (
      <div className="row flex-lg-grow-1">
        <div className="col-md-6 mb-4">
          <SongForm />
        </div>
        <div className="col-md-6 ScrobbleList-container">
          <ScrobbleList />
        </div>
      </div>
    );
  }
}
