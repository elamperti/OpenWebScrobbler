import React from 'react'
import { PropTypes } from 'prop-types'
import { NavLink as RouterNavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { NavItem, NavLink } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function NavigationItem({
  i18nKey,
  href,
  icon,
}) {
  const {t} = useTranslation()

  return (
    <NavItem data-cy={`NavigationItem-${i18nKey}`}>
      <NavLink tag={RouterNavLink} to={href} activeClassName="active">
        <FontAwesomeIcon icon={icon} />
        {t(i18nKey)}
      </NavLink>
    </NavItem>
  )
}

NavigationItem.propTypes = {
  i18nKey: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
}
