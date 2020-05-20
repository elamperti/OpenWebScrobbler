import React from 'react';
import PropTypes from 'prop-types';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { NavItem, NavLink } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function NavigationItem({
  external,
  href,
  i18nKey,
  icon,
}) {
  const { t } = useTranslation();
  let navLinkProps = {
    tag: RouterNavLink,
    to: href,
    activeClassName: 'active',
  };

  if (external) {
    navLinkProps = {
      href,
    };
  }

  return (
    <NavItem data-cy={`NavigationItem-${i18nKey}`}>
      <NavLink {...navLinkProps}>
        <FontAwesomeIcon icon={icon} />
        {t(i18nKey)}
      </NavLink>
    </NavItem>
  );
}

NavigationItem.propTypes = {
  external: PropTypes.bool,
  href: PropTypes.string.isRequired,
  i18nKey: PropTypes.string.isRequired,
  icon: PropTypes.object.isRequired,
};

NavigationItem.defaultProps = {
  external: false,
};
