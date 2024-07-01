import { faCog, faExternalLinkAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useGrowthBook } from '@growthbook/growthbook-react';
import { useQueryClient } from '@tanstack/react-query';
import Avatar from 'components/Avatar';
import { SettingsModalContext } from 'components/SettingsModal/SettingsModalContext';
import { useUserData } from 'hooks/useUserData';
import { useContext } from 'react';
import { Trans } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, NavItem, NavLink } from 'reactstrap';
import { logOut } from 'store/actions/userActions';
import { useBootstrapBreakpoint, BS_SIZE_MD } from 'utils/bootstrapBreakpoints';

import './UserDropdown.scss';


export default function UserDropdow() {
  const dispatch = useDispatch();
  const { user } = useUserData();
  const bsBreakpoint = useBootstrapBreakpoint();
  const queryClient = useQueryClient();
  const growthbook = useGrowthBook();
  const { setSettingsModalVisible } = useContext(SettingsModalContext);

  const onLogOut = () => {
    logOut(dispatch)().then(() => {
      queryClient.invalidateQueries({
        queryKey: ['user'],
      });

      // ToDo: clear local storage

      if (growthbook?.ready) {
        const newGBAttributes = growthbook.getAttributes();
        delete newGBAttributes.id;
        newGBAttributes.loggedIn = false;
        growthbook.setAttributes(newGBAttributes);
      }

      try {
        localStorage.removeItem('hashedUID');
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('Unable to remove UID from localstorage');
      }
    });
  };

  if (!user) return null;

  return (
    <>
      <UncontrolledDropdown data-cy="UserDropdown" nav inNavbar={bsBreakpoint < BS_SIZE_MD}>
        <DropdownToggle nav caret className="ows-dropdown-user">
          <Avatar url={user.avatar?.md} alt={user.name} size="sm" />
          <span className="ows-username sentry-mask" data-cy="UserDropdown-username">
            {user.name}
          </span>
        </DropdownToggle>
        <DropdownMenu end>
          <DropdownItem href={user.url} target="_blank" rel="noopener" data-cy="UserDropdown-profileLink">
            <Trans i18nKey="viewProfile">Visit profile</Trans>
            <FontAwesomeIcon className="ms-1" color="var(--bs-gray)" icon={faExternalLinkAlt} />
          </DropdownItem>
          <DropdownItem divider />
          <DropdownItem onClick={() => setSettingsModalVisible(true)} data-cy="UserDropdown-settings">
            <FontAwesomeIcon icon={faCog} />
            <Trans i18nKey="settings">Settings</Trans>
          </DropdownItem>
          <DropdownItem className="d-none d-md-block" onClick={onLogOut} data-cy="UserDropdown-logout">
            <FontAwesomeIcon icon={faSignOutAlt} />
            <Trans i18nKey="logOut">Sign out</Trans>
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
      <NavItem className="d-block d-md-none">
        <NavLink onClick={onLogOut}>
          <FontAwesomeIcon icon={faSignOutAlt} />
          <Trans i18nKey="logOut">Sign out</Trans>
        </NavLink>
      </NavItem>
    </>
  );
}
