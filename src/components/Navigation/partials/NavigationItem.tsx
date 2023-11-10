import React from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { Trans } from 'react-i18next';
import { NavItem, NavLink } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';

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
