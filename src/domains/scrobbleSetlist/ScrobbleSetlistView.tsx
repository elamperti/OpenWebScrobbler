import { faList } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export function ScrobbleSetlistView() {
  return (
    <>
      <h2>
        <FontAwesomeIcon icon={faList} className="me-2" />
        Scrobble Setlist View
      </h2>
      {/* <Button>`Date: ${data.setlist.eventDate}`</Button> */}
    </>
  );
}
