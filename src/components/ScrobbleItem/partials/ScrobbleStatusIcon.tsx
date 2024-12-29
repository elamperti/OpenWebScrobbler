import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCompactDisc, faInbox, faSync, faTimes } from '@fortawesome/free-solid-svg-icons';

interface ScrobbleStatusIconProps {
  status?: 'success' | 'retry' | 'error' | 'pending' | 'queued';
}

export function ScrobbleStatusIcon({ status }: ScrobbleStatusIconProps) {
  if (!status) return null;

  let statusIcon;
  switch (status) {
    case 'success':
      statusIcon = faCheck;
      break;
    case 'retry':
      statusIcon = faSync;
      break;
    case 'error':
      statusIcon = faTimes;
      break;
    case 'pending':
      statusIcon = faCompactDisc;
      break;
    case 'queued':
      statusIcon = faInbox;
      break;
    default:
      return null;
  }

  return (
    <span className="status-icon">
      <FontAwesomeIcon size="xs" icon={statusIcon} spin={statusIcon === faCompactDisc} />
    </span>
  );
}
