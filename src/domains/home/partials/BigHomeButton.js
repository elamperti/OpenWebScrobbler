import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import './BigHomeButton.scss';

export default function BigHomeButton({ href, i18nKey, icon }) {
  const { t } = useTranslation();

  return (
    <div data-cy={`BigHomeButton-${i18nKey}`} className="ows-BigHomeButton mb-3 mb-md-0 px-2">
      <Button to={href} className="py-3 px-2" block tag={Link} size="lg" color="secondary">
        <FontAwesomeIcon icon={icon} size="3x" className="d-block mb-3 mx-auto" />
        {t(i18nKey)}
      </Button>
    </div>
  );
}

BigHomeButton.propTypes = {
  href: PropTypes.string.isRequired,
  i18nKey: PropTypes.string.isRequired,
  icon: PropTypes.object,
};
