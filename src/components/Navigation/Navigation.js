import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Collapse, Nav, Navbar, NavbarBrand, NavbarToggler } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHeadphonesAlt,
  faCompactDisc,
  faSignInAlt,
  faUserFriends,
} from '@fortawesome/free-solid-svg-icons';
import {
  faPlayCircle,
} from '@fortawesome/free-regular-svg-icons';

import LanguageSelector from './partials/LanguageSelector';
import NavigationItem from './partials/NavigationItem';
import UserDropdown from './partials/UserDropdown';
import { LASTFM_AUTH_URL } from 'Constants';
import './Navigation.scss';

export default function Navigation() {
  const isLoggedIn = useSelector(state => state.user.isLoggedIn);
  const isDonor = useSelector(state => state.settings.isDonor);
  const [menuIsOpen, toggleMenu] = useState(false);

  return (
    <Navbar color="dark" dark expand="md" data-cy="Navigation" id="ows-Navigation" className={`${isDonor ? 'ows-donor' : ''}`}>
      <NavbarBrand tag={Link} to="/" data-cy="Navigation-logo" className="flex-grow-1 flex-md-grow-0">
        <FontAwesomeIcon icon={faHeadphonesAlt} className="d-none d-sm-inline" />
        Open Scrobbler
      </NavbarBrand>
      <ul className="m-auto pl-0">
        {/* ToDo: try to use only one LanguageSelector */}
        <LanguageSelector className="d-md-none text-right" />
      </ul>
      <NavbarToggler title="Menu" onClick={() => toggleMenu(!menuIsOpen)} />
      <Collapse isOpen={menuIsOpen} navbar>
        {/* ToDo: show these items for visitors too */}
        {isLoggedIn && (
          <Nav navbar data-cy="Navigation-appMenuItems">
            <NavigationItem href="/scrobble/song" i18nKey="song" icon={faPlayCircle} />
            <NavigationItem href="/scrobble/album" i18nKey="album" icon={faCompactDisc} />
            <NavigationItem href="/scrobble/user" i18nKey="otherUser" icon={faUserFriends} />
          </Nav>
        )}
        <Nav className="ml-auto" navbar>
          <LanguageSelector className="d-none d-md-block" />
          {isLoggedIn
            ? <UserDropdown />
            : <NavigationItem external href={LASTFM_AUTH_URL} i18nKey="logIn" icon={faSignInAlt} />
          }
        </Nav>
      </Collapse>
    </Navbar>
  );
}
