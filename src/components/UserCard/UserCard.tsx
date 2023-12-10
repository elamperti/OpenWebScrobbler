import { Trans } from 'react-i18next';

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

export function UserCard({ name, user, isHeading, withLinkToProfile }: UserCardProps) {
  const externalLink = (
    <div>
      <a
        href={user.url || `https://last.fm/user/${name}`}
        // eslint-disable-next-line react/jsx-no-target-blank
        target="_blank"
        rel="noopener noreferrer"
      >
        <Trans i18nKey="visitProfile">Visit profile</Trans>
      </a>{' '}
      <FontAwesomeIcon icon={faExternalLinkAlt} />
    </div>
  );

  return (
    <div className={`user-card d-flex w-100 px-3 g-0 align-items-center${isHeading ? ' py-3' : ''}`}>
      <div className="text-center">
        <Avatar url={user.avatar.md} alt={name} size="md" />
      </div>
      <div className="d-flex-grow-1 ps-3">
        <h3>{name}</h3>
        {withLinkToProfile && externalLink}
      </div>
    </div>
  );
}

export default UserCard;
