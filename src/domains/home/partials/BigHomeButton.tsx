import type { IconProp } from '@fortawesome/fontawesome-svg-core';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Trans } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';

import './BigHomeButton.scss';


export default function BigHomeButton({ href, i18nKey, icon }: { href: string; i18nKey: string; icon: IconProp }) {
  return (
    <div data-cy={`BigHomeButton-${i18nKey}`} className="ows-BigHomeButton mb-3 mb-md-0 px-2">
      <Button to={href} className="py-3 px-2" block tag={Link} size="lg" color="secondary">
        <FontAwesomeIcon icon={icon} size="3x" className="d-block mb-3 mx-auto" />
        <Trans i18nKey={i18nKey} />
      </Button>
    </div>
  );
}
