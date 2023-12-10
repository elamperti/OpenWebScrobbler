import { useDispatch, useSelector } from 'react-redux';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, NavItem, NavLink } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faExternalLinkAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { Trans } from 'react-i18next';

import Avatar from 'components/Avatar';
import { openSettingsModal } from 'store/actions/settingsActions';
import { logOut } from 'store/actions/userActions';
import { useBootstrapBreakpoint, BS_SIZE_MD } from 'utils/bootstrapBreakpoints';

import type { RootState } from 'store';

import './UserDropdown.scss';

export default function UserDropdow() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const bsBreakpoint = useBootstrapBreakpoint();

  return (
    <>
      <UncontrolledDropdown data-cy="UserDropdown" nav inNavbar={bsBreakpoint < BS_SIZE_MD}>
        <DropdownToggle nav caret className="ows-dropdown-user">
          <Avatar url={user.avatar?.md} alt={user.name} size="sm" />
          <span className="ows-username" data-cy="UserDropdown-username">
            {user.name}
          </span>
        </DropdownToggle>
        <DropdownMenu end>
          <DropdownItem href={user.url} target="_blank" rel="noopener" data-cy="UserDropdown-profileLink">
            <Trans i18nKey="viewProfile">Visit profile</Trans>
            <FontAwesomeIcon className="ms-1" color="var(--bs-gray)" icon={faExternalLinkAlt} />
          </DropdownItem>
          <DropdownItem divider />
          <DropdownItem onClick={() => dispatch(openSettingsModal())}>
            <FontAwesomeIcon icon={faCog} />
            <Trans i18nKey="settings">Settings</Trans>
          </DropdownItem>
          <DropdownItem className="d-none d-md-block" onClick={logOut(dispatch)}>
            <FontAwesomeIcon icon={faSignOutAlt} />
            <Trans i18nKey="logOut">Sign out</Trans>
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
      <NavItem className="d-block d-md-none">
        <NavLink onClick={logOut(dispatch)}>
          <FontAwesomeIcon icon={faSignOutAlt} />
          <Trans i18nKey="logOut">Sign out</Trans>
        </NavLink>
      </NavItem>
    </>
  );
}
