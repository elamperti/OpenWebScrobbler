import { Trans } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCompactDisc } from '@fortawesome/free-solid-svg-icons';

const Spinner = ({ noTranslation = false }: { noTranslation?: boolean }) => {
  return (
    <div className="text-center mt-5 mx-auto">
      <FontAwesomeIcon icon={faCompactDisc} color="var(--bs-gray-500)" size="4x" spin />
      {!noTranslation && (
        <p className="mt-2">
          <Trans i18nKey="loading">Loading...</Trans>
        </p>
      )}
    </div>
  );
};

export default Spinner;
