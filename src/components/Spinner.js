import React from 'react';
import { Trans } from 'react-i18next';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCompactDisc,
} from '@fortawesome/free-solid-svg-icons';

const Spinner = () => {
  return (
    <div className="text-center mt-5 mx-auto">
      <FontAwesomeIcon icon={faCompactDisc} color="var(--gray-light)" size="4x" spin />
      <br />
      <p className="mt-1">
        <Trans i18nKey="loading">Loading...</Trans>
      </p>
    </div>
  );
};

export default Spinner;
