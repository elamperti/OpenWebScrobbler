import { useState } from 'react';
import { Trans } from 'react-i18next';

import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faEllipsisH, faRedoAlt, faShoppingCart } from '@fortawesome/free-solid-svg-icons';

import { getAmznLink } from 'Constants';

import type { Scrobble } from 'utils/types/scrobble';

interface ScrobbleItemMenuProps {
  scrobble: Scrobble;
  scrobbleAgain: () => void;
  onScrobble?: (scrobble: Scrobble) => void;
  keepScrobbleTimestamp?: boolean;
}

export function ScrobbleItemMenu({
  scrobble,
  scrobbleAgain,
  onScrobble,
  keepScrobbleTimestamp,
}: ScrobbleItemMenuProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleMoreMenu = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const cloneScrobble = () => {
    onScrobble(
      keepScrobbleTimestamp
        ? scrobble
        : {
            ...scrobble,
            timestamp: undefined,
          }
    );
  };

  return (
    <Dropdown isOpen={dropdownOpen} toggle={toggleMoreMenu}>
      <DropdownToggle
        tag="div"
        onClick={toggleMoreMenu}
        aria-expanded={dropdownOpen}
        data-cy="ScrobbleItem-toggle-menu"
      >
        <Button className="btn-more" size="sm" color="secondary" outline>
          <FontAwesomeIcon icon={faEllipsisH} />
        </Button>
      </DropdownToggle>
      <DropdownMenu end data-cy="ScrobbleItem-menu">
        <DropdownItem onClick={scrobbleAgain}>
          <FontAwesomeIcon icon={faRedoAlt} className="me-2" />
          <Trans i18nKey="scrobbleAgain">Scrobble again</Trans>
        </DropdownItem>
        <DropdownItem tag="a" href={getAmznLink(scrobble.artist, scrobble.album)} target="_blank" rel="noopener">
          <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
          <Trans i18nKey="buyOnAmzn" />
        </DropdownItem>
        {onScrobble && (
          <>
            <DropdownItem key="cloneDivider" divider />
            <DropdownItem key="clone" onClick={cloneScrobble}>
              <FontAwesomeIcon icon={faCopy} className="me-2" />
              <Trans i18nKey="copyToEditor">Copy to editor</Trans>
            </DropdownItem>
          </>
        )}
      </DropdownMenu>
    </Dropdown>
  );
}
