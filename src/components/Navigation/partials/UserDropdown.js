import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, NavItem, NavLink } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faExternalLinkAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

import Avatar from 'components/Avatar';
import { openSettingsModal } from 'store/actions/settingsActions';
import { logOut } from 'store/actions/userActions';

import './UserDropdown.scss';

export default function UserDropdow() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  return (
    <React.Fragment>
      <UncontrolledDropdown data-cy="UserDropdown" nav inNavbar>
        <DropdownToggle nav caret className="ows-dropdown-user">
          <Avatar user={user} alt={user.name} size="sm" />
          <span className="ows-username" data-cy="UserDropdown-username">
            {user.name}
          </span>
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem href={user.url} target="_blank" rel="noopener" data-cy="UserDropdown-profileLink">
            {t('viewProfile')}
            <FontAwesomeIcon className="ms-1" color="var(--bs-gray)" icon={faExternalLinkAlt} />
          </DropdownItem>
          <DropdownItem divider />
          <DropdownItem onClick={openSettingsModal(dispatch)}>
            <FontAwesomeIcon icon={faCog} />
            {t('settings')}
          </DropdownItem>
          <DropdownItem className="d-none d-md-block" onClick={logOut(dispatch)}>
            <FontAwesomeIcon icon={faSignOutAlt} />
            {t('logOut')}
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
      <NavItem className="d-block d-md-none">
        <NavLink onClick={logOut(dispatch)}>
          <FontAwesomeIcon icon={faSignOutAlt} />
          {t('logOut')}
        </NavLink>
      </NavItem>
    </React.Fragment>
  );
}
