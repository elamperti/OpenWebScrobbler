import { ChangeEventHandler, useState } from 'react';
import { Trans } from 'react-i18next';
import { Alert, FormGroup, Input } from 'reactstrap';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type TracklistCleanupFormProps = {
  onCleanupPatternChange: ChangeEventHandler<HTMLInputElement>;
};

export function TracklistCleanupForm({ onCleanupPatternChange }: TracklistCleanupFormProps) {
  const [showCleanupPatternCopy, setShowCleanupPatternCopy] = useState(false);

  const toggleCleanupPatternCopy = () => {
    setShowCleanupPatternCopy(!showCleanupPatternCopy);
  };

  return (
    <div className="d-flex flex-column mt-4 album-cleanup-pattern">
      <FormGroup>
        <div className="col-12">
          <label htmlFor="albumCleanupPattern" className="mb-2">
            <Trans i18nKey="albumCleanupPattern" />:
          </label>
          <FontAwesomeIcon
            id="cleanupPatternInfoIcon"
            className="px-3"
            icon={faQuestionCircle}
            color="var(--bs-gray)"
            onClick={toggleCleanupPatternCopy}
          />
        </div>
        <div className="col-6">
          <Input className="form-control-sm form-control" id="albumCleanupPattern" onChange={onCleanupPatternChange} />
        </div>
        <div className="col-12">
          <Alert
            color="dark"
            isOpen={showCleanupPatternCopy}
            toggle={toggleCleanupPatternCopy}
            className="text-justify mt-3"
            fade={false}
          >
            <Trans i18nKey="albumCleanupPatternDescription" />
          </Alert>
        </div>
      </FormGroup>
    </div>
  );
}
