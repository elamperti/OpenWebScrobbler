import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { translate } from 'react-i18next';
import i18n, { languageList } from 'i18n'; // just for the lang switcher
import { connect } from 'react-redux';
import ReactGA from 'react-ga';

import { Link } from 'react-router-dom';
import {
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink,
  UncontrolledDropdown,
} from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHeadphonesAlt,
  faCog,
  faExternalLinkAlt,
  faSignInAlt,
  faSignOutAlt,
  faGlobe,
  faUserAstronaut,
} from '@fortawesome/free-solid-svg-icons';
import {
  faPlayCircle,
} from '@fortawesome/free-regular-svg-icons';

import { logOut } from 'store/actions/userActions';
import { dismissAlert } from 'store/actions/alertActions';

import SettingsModal from 'components/SettingsModal';

import './Navigation.css';

class Navigation extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.toggleSettingsModal = this.toggleSettingsModal.bind(this);
    this.openSettingsModal = this.openSettingsModal.bind(this);
    this.state = {
      menuIsOpen: false,
      settingsModalOpen: false,
    };
  }

  openSettingsModal() {
    ReactGA.modalview('/settings')
    this.props.dismissAlert({
      category: 'settings'
    });
    this.toggleSettingsModal();
  }

  toggleSettingsModal() {
    this.setState({
      settingsModalOpen: !this.state.settingsModalOpen,
    });
  }

  toggle() {
    this.setState({
      menuIsOpen: !this.state.menuIsOpen
    });
  }

  render() {
    const t = this.props.t; // Translations
    const lastfmAuthURL = `https://www.last.fm/api/auth/?api_key=${process.env.REACT_APP_LASTFM_API_KEY}` +
                          `&cb=${window.location.protocol}//${window.location.host}/`;

    let appMenuItems;
    let userMenuItems;

    let generateLinkParams = (dest) => {
      return {
        tag: Link,
        to: dest,
        className: this.props.location.pathname === dest ? 'active' : '',
      };
    }

    let availableLanguageItems = [];
    let changeLanguage = (langCode) => {
      return () => {
        ReactGA.event({
          category: 'Language',
          action: 'Change',
          label: langCode,
        });
        i18n.changeLanguage(langCode);
      };
    };

    for (let lang of languageList) {
      // The language names are not translated because they must remain in their original language
      availableLanguageItems.push(
        <DropdownItem
          key={lang.code}
          active={lang.code === i18n.language}
          onClick={changeLanguage(lang.code)}
        >
          {lang.name}
        </DropdownItem>
      );
    }

    let getLanguageSelector = (extraClassNames='') => {
      return (
        <UncontrolledDropdown className={`language-selector ${extraClassNames}`} nav inNavbar>
          <DropdownToggle title="Select language" nav caret>
            <FontAwesomeIcon icon={faGlobe} />
            <span className="d-none d-lg-inline">{t('language')}</span>
          </DropdownToggle>
          <DropdownMenu right>
            {availableLanguageItems}
            <a className="px-2 d-none d-sm-block text-center translationCTA" href="https://github.com/elamperti/OpenWebScrobbler/#translations">
              {t('translateYourLanguage')}
            </a>
          </DropdownMenu>
        </UncontrolledDropdown>
      );
    };

    if (this.props.user.isLoggedIn) {
      appMenuItems = (
        <Nav navbar>
          <NavItem>
            <NavLink {...generateLinkParams("/scrobble/song")}>
              <FontAwesomeIcon icon={faPlayCircle} />
              {t('song')}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink disabled href="#">
              {t('moreComingSoon')}
            </NavLink>
          </NavItem>
        </Nav>
      );

      userMenuItems = (
        <Nav className="ml-auto" navbar>
          {getLanguageSelector('d-none d-md-block')}
          <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret>
              { !this.props.user.avatarURL ? (
                <FontAwesomeIcon icon={faUserAstronaut} color={ this.props.settings.isDonor ? '#ffd161' : 'white' } />
              ) : (
                <img
                  src={this.props.user.avatarURL}
                  alt={this.props.user.name}
                  className="user-avatar rounded-circle"
                />
              )}
              <span className="username">
                {this.props.user.name}
              </span>
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem href={this.props.user.url} target="_blank" rel="noopener">
                  {t('viewProfile')}
                  <FontAwesomeIcon className="ml-1" color="var(--gray)" icon={faExternalLinkAlt} />
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem onClick={() => this.openSettingsModal()}>
                <FontAwesomeIcon icon={faCog} />
                  {t('settings')}
              </DropdownItem>
              <DropdownItem className="d-none d-md-block" onClick={this.props.logOut}>
                <FontAwesomeIcon icon={faSignOutAlt} />
                {t('logOut')}
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          <NavItem className="d-block d-md-none">
            <NavLink onClick={this.props.logOut}>
              <FontAwesomeIcon icon={faSignOutAlt} />
              {t('logOut')}
            </NavLink>
          </NavItem>
        </Nav>
      );
    } else {
      userMenuItems = (
        <Nav className="ml-auto" navbar>
          {getLanguageSelector('d-none d-md-block')}
          <NavItem>
            <NavLink href={lastfmAuthURL}>
              <FontAwesomeIcon icon={faSignInAlt} />
              {t('logIn')}
            </NavLink>
          </NavItem>
        </Nav>
      );
    }

    return (
      <div>
        <Navbar color="dark" dark expand="md" className={`${this.props.settings.isDonor ? 'donor' : ''}`}>
          <NavbarBrand tag={Link} to="/" className="flex-grow-1 flex-md-grow-0">
            <FontAwesomeIcon icon={faHeadphonesAlt} className="d-none d-sm-inline" />
            Open Scrobbler
          </NavbarBrand>
          <ul className="m-auto pl-0">
            {getLanguageSelector('d-md-none text-right')}
          </ul>
          <NavbarToggler title="Menu" onClick={this.toggle} />
          <Collapse isOpen={this.state.menuIsOpen} navbar>
            { appMenuItems }
            { userMenuItems }
          </Collapse>
        </Navbar>
        <SettingsModal isOpen={this.state.settingsModalOpen} toggle={this.toggleSettingsModal} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    settings: state.settings,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    dismissAlert: dismissAlert(dispatch),
    logOut: logOut(dispatch),
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(
  translate(['common'])(Navigation)
));
