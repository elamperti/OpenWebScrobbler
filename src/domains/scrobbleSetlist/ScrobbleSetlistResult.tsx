import { faList } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery } from '@tanstack/react-query';
// import Tracklist from 'domains/scrobbleAlbum/partials/Tracklist';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// import { Button } from 'reactstrap';

import { setlistSearch as SetlistFmSearch } from 'utils/clients/setlistfm';

export function ScrobbleSetlistResult() {
  const params = useParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  // This extracts the search parameter from the URL
  useEffect(() => {
    setQuery(decodeURIComponent(params?.setlistId || ''));
  }, [params]);

  const { data } = useQuery({
    queryKey: ['setlist', query],
    queryFn: () => {
      return SetlistFmSearch(query);
    },
    enabled: !!query,
  });

  useEffect(() => {
    if (data !== undefined) {
      navigate(`/scrobble/setlist/view/${data.id}`, { state: data });
    }
  }, [data, navigate]);

  return (
    <>
      <h2>
        <FontAwesomeIcon icon={faList} className="me-2" />
        Scrobble Setlist Result
      </h2>
      {/* <Button>`Date: ${data.setlist.eventDate}`</Button> */}
    </>
  );
}
