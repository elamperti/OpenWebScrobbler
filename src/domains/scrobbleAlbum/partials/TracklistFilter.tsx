import { ChangeEventHandler, useCallback, useContext, useState } from 'react';
import { Trans } from 'react-i18next';
import { Input } from 'reactstrap';
import { faFilter, faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CleanupPatternContext, strToCleanupPattern } from '../CleanupContext';

import './TracklistFilter.scss';

export function TracklistFilter() {
  const [showCleanupPatternCopy, setShowCleanupPatternCopy] = useState(false);
  const [showForm, setFormVisible] = useState(false);
  const { cleanupPattern, setCleanupPattern } = useContext(CleanupPatternContext);
  const [value, setValue] = useState('');

  const handleCleanupPatternChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      const { value } = event.target;
      setValue(value);
      setCleanupPattern(strToCleanupPattern(value));
    },
    [setCleanupPattern]
  );

  return (
    <div className="d-flex flex-row-reverse align-items-center TracklistFilter-container">
      <FontAwesomeIcon icon={faFilter} className="text-secondary" onClick={() => setFormVisible(!showForm)} />
      {showForm && (
        <div className="me-2 d-flex flex-row">
          <label htmlFor="albumCleanupPattern">
            <Trans i18nKey="filter" />:
          </label>
          <Input
            className="form-control-sm form-control ms-2"
            id="albumCleanupPattern"
            onChange={handleCleanupPatternChange}
            value={value}
          />
        </div>
      )}
    </div>
  );
}
