import React from 'react';
import { useTranslation } from 'react-i18next';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

import Avatar from 'components/Avatar';

import './UserCard.css';

type UserCardProps = {
  name: string;
  user: any;
  isHeading: boolean;
  withLinkToProfile?: boolean;
};

export const UserCard: React.FC<UserCardProps> = (props) => {
  const { t } = useTranslation();
  // ToDo: use URL from user.info endpoint
  const externalLink = (
    <div>
      <a
        href={`https://last.fm/user/${props.name}`}
        // eslint-disable-next-line react/jsx-no-target-blank
        target="_blank"
        rel="noopener noreferrer"
      >
        {t('visitProfile')}
      </a>{' '}
      {/* @ts-expect-error resolve-fa-types */}
      <FontAwesomeIcon icon={faExternalLinkAlt} />
    </div>
  );

  return (
    <div className={`user-card d-flex w-100 px-3 no-gutters align-items-center ${props.isHeading ? 'py-3' : ''}`}>
      <div className="text-center">
        <Avatar user={props.user} alt={props.name} size="md" />
      </div>
      <div className="d-flex-grow-1 pl-3">
        <h3>{props.name}</h3>
        {props.withLinkToProfile && externalLink}
      </div>
    </div>
  );
};

export default UserCard;
