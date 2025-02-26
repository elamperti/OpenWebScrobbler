import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { Card, CardBody } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faUser } from '@fortawesome/free-solid-svg-icons';

import type { Setlist } from 'utils/types/setlist';

export function SetlistCard({
  setlist,
  className = '',
  linkArtist = false,
}: {
  setlist: Setlist;
  className?: string;
  linkArtist?: boolean;
}) {
  const { t } = useTranslation();
  const shortMonth = t('dates.months.short', { returnObjects: true })[setlist.date.getMonth()];

  const ArtistInfo = (
    <>
      <FontAwesomeIcon icon={faUser} className="me-2" />
      {setlist.artist}
    </>
  );

  return (
    <Card className={className}>
      <CardBody className="row no-gutters px-4">
        <div className="col-3 calendar-thing text-center bg-dark rounded-1 py-1" style={{ whiteSpace: 'nowrap' }}>
          <span className="month text-small lh-1 position-relative text-uppercase" style={{ top: '0.2em' }}>
            {shortMonth}
          </span>
          <span className="day d-block fs-1 lh-1 fw-bold py-0 my-0 text-white">{setlist.date.getDate()}</span>
          <small className="year text-small">{setlist.date.getFullYear()}</small>
        </div>
        <div className="col-9 ps-3">
          <h3 className="h4 pt-1 text-truncate text-white">{setlist.venue.name}</h3>
          <span className="d-block text-truncate">
            {linkArtist ? (
              <Link
                to={`/scrobble/setlist/search/${encodeURIComponent(setlist.artist)}`}
                className="text-decoration-none"
              >
                {ArtistInfo}
              </Link>
            ) : (
              ArtistInfo
            )}
          </span>
          <small>
            <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />
            {setlist.venue.city}
            {setlist.venue.state ? `, ${setlist.venue.state}` : ''} <span>({setlist.venue.country})</span>
          </small>
        </div>
      </CardBody>
    </Card>
  );
}
