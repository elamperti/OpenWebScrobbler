import { faCheck, faCircleExclamation, faCompactDisc } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { ReactNode } from 'react';

export function ProgressItem({
  children,
  isWaiting = false,
  isLoading = false,
  isError = false,
  isDone = false,
}: {
  children: ReactNode;
  isWaiting?: boolean;
  isLoading?: boolean;
  isError?: boolean;
  isDone?: boolean;
}) {
  let icon = null;
  let classname = '';
  let status = 'waiting';

  // Transform the props into a status
  if (isError) {
    status = 'error';
  } else if (isLoading) {
    status = 'loading';
  } else if (isDone) {
    status = 'done';
  }

  switch (status) {
    case 'error':
      icon = <FontAwesomeIcon icon={faCircleExclamation} className="me-2" />;
      classname = 'text-danger';
      break;
    case 'loading':
      icon = <FontAwesomeIcon icon={faCompactDisc} className="me-2" spin />;
      break;
    case 'done':
      icon = <FontAwesomeIcon icon={faCheck} className="me-2" color="#53a753" />;
      break;
    case 'waiting':
    default:
      icon = <FontAwesomeIcon icon={faCompactDisc} className="me-2" />;
      classname = 'text-secondary';
      break;
  }

  return (
    <div className={classname} data-cy="ProgressItem" data-status={status}>
      {icon}
      {children}
    </div>
  );
}
