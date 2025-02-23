import { useContext } from 'react';
import { useDispatch } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import { useGrowthBook } from '@growthbook/growthbook-react';
import ReactGA from 'react-ga-neo';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, NavItem, NavLink } from 'reactstrap';
import { Trans } from 'react-i18next';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faCrown, faExternalLinkAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

import { useUserData } from 'hooks/useUserData';
import { useSettings } from 'hooks/useSettings';
import { logOut } from 'store/actions/userActions';

import { useBootstrapBreakpoint, BS_SIZE_MD } from 'utils/bootstrapBreakpoints';
import Avatar from 'components/Avatar';
import { SettingsModalContext } from 'components/SettingsModal/SettingsModalContext';

import './UserDropdown.scss';

export default function UserDropdow() {
  const dispatch = useDispatch();
  const { user } = useUserData();
  const { settings } = useSettings();
  const bsBreakpoint = useBootstrapBreakpoint();
  const queryClient = useQueryClient();
  const growthbook = useGrowthBook();
  const { setSettingsModalVisible } = useContext(SettingsModalContext);

  const onLogOut = () => {
    ReactGA.event({
      category: 'Session',
      action: 'Logout',
      label: 'Intent',
    });
    logOut(dispatch)().finally(() => {
      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: ['user'],
        });
      }, 1000);

      if (growthbook?.ready) {
        const newGBAttributes = growthbook.getAttributes();
        delete newGBAttributes.id;
        newGBAttributes.loggedIn = false;
        growthbook.setAttributes(newGBAttributes);
      }
    });
  };

  if (!user) return null;

  return (
    <>
      <UncontrolledDropdown data-cy="UserDropdown" nav inNavbar={bsBreakpoint < BS_SIZE_MD}>
        <DropdownToggle nav caret className="ows-dropdown-user">
          {settings?.hasActiveSubscription && <FontAwesomeIcon icon={faCrown} className="ows-crown" size="xs" />}
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
