import { useState } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH, faRedoAlt, faShoppingCart, faCopy } from '@fortawesome/free-solid-svg-icons';
import { Trans } from 'react-i18next';
import { getAmznLink } from 'Constants';
import type { Scrobble } from 'utils/types/scrobble';

interface ScrobbleItemMenuProps {
  scrobble: Scrobble;
  scrobbleAgain: () => void;
  cloneScrobbleTo?: (scrobble: Scrobble) => void;
}

export function ScrobbleItemMenu({ scrobble, scrobbleAgain, cloneScrobbleTo }: ScrobbleItemMenuProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleMoreMenu = () => {
    setDropdownOpen(!dropdownOpen);
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
        {cloneScrobbleTo && (
          <>
            <DropdownItem key="cloneDivider" divider />
            <DropdownItem key="clone" onClick={() => cloneScrobbleTo(scrobble)}>
              <FontAwesomeIcon icon={faCopy} className="me-2" />
              <Trans i18nKey="copyToEditor">Copy to editor</Trans>
            </DropdownItem>
          </>
        )}
      </DropdownMenu>
    </Dropdown>
  );
}
