import React from 'react';
import { translate, Trans } from 'react-i18next';

import { Alert, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faComment,
  faExclamation,
} from '@fortawesome/free-solid-svg-icons';

import './UpdateToast.css';

class UpdateToast extends React.Component {
  constructor(props) {
    super(props);
    this.reloadPage = this.reloadPage.bind(this);
  }

  reloadPage() {
    window.location.reload();
  }

  render() {
    return (
      <Alert color="primary" className="UpdateToast mx-4 py-1">
        <FontAwesomeIcon icon={faExclamation} transform="shrink-8" mask={faComment} className="mr-2" />
        <Trans i18nKey="updates.newVersionAvailable">
          There's a new version available! Please <Button size="sm" color="info" onClick={this.reloadPage}>reload the page</Button>
        </Trans>
      </Alert>
    );
  }
}

export default translate(['common'])(UpdateToast);
