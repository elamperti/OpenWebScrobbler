import { faList } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SetlistViewer from 'domains/scrobbleAlbum/partials/Setlist';
import { useLocation } from 'react-router-dom';
import { setlistTransformer } from 'utils/clients/setlistfm/transformers.ts/setlist.transformer';

export function ScrobbleSetlistView() {
  const { state } = useLocation();

  const setlist = setlistTransformer(state);
  // const tracklist = setlist.sets[0]

  // Need to convert simple setlist songs into "tracks". I think it's best to do that here?

  return (
    <>
      <h2>
        <FontAwesomeIcon icon={faList} className="me-2" />
        Scrobble Setlist View
      </h2>
      <SetlistViewer setlist={setlist} />
      {/* <Button>`Date: ${data.setlist.eventDate}`</Button> */}
    </>
  );
}
