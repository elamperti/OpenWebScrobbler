import type { IconProp } from '@fortawesome/fontawesome-svg-core';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Trans } from 'react-i18next';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { NavItem, NavLink } from 'reactstrap';


export default function NavigationItem({
  external = false,
  href,
  i18nKey,
  icon,
}: {
  external?: boolean;
  href: string;
  i18nKey: string;
  icon: IconProp;
}) {
  return (
    <NavItem data-cy={`NavigationItem-${i18nKey}`}>
      <NavLink tag={RouterNavLink} to={href} href={external ? href : undefined}>
        <FontAwesomeIcon icon={icon} />
        <Trans i18nKey={i18nKey} />
      </NavLink>
    </NavItem>
  );
}
