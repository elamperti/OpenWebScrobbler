import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faExternalLinkAlt,
} from '@fortawesome/free-solid-svg-icons';

import Avatar from 'components/Avatar';

import './UserCard.css';

const UserCard = props => {
  // ToDo: use URL from user.info endpoint
  let externalLink = (
    <div>
      <a
        href={`https://last.fm/user/${props.name}`}
        // eslint-disable-next-line react/jsx-no-target-blank
        target="_blank"
        rel="noopener"
      >
        {props.t('visitProfile')}
      </a>
      {' '}
      <FontAwesomeIcon icon={faExternalLinkAlt} />
    </div>
  );

  return (
    <div className={`user-card d-flex w-100 mb-3 px-3 no-gutters align-items-center ${props.isHeading ? 'py-3' : ''}`}>
      <div className="text-center">
        <Avatar user={props.user} alt={props.name} size="md" />
      </div>
      <div className="d-flex-grow-1 pl-3">
        <h3>{props.name}</h3>
        { props.withLinkToProfile ? externalLink : null }
      </div>
    </div>
  );
};

UserCard.propTypes = {
  name: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  isHeading: PropTypes.bool,
  withLinkToProfile: PropTypes.bool,
};

UserCard.defaultProps = {
  rect: false,
  withLinkToProfile: false,
}

export default translate(['common'])(UserCard);
