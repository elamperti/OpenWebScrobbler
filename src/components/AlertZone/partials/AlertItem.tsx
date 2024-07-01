import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { Trans } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Alert as ReactstrapAlert } from 'reactstrap';
import { dismissAlert } from 'store/actions/alertActions';

import { Alert } from '../types';


export default function AlertItem({ id: alertId, type, errorNumber, title, message, rawMessage, icon }: Alert) {
  const [isOpen, setOpenState] = useState(true);
  const dispatch = useDispatch();

  const onClose = () => {
    setOpenState(false);
    setTimeout(() => dispatch(dismissAlert({ id: alertId })), 1000);
  };

  return (
    <ReactstrapAlert isOpen={isOpen} fade={false} color={type} toggle={onClose}>
      <div className="d-flex">
        {icon && (
          <div className="me-4">
            <FontAwesomeIcon size={title ? '3x' : null} icon={icon} />
          </div>
        )}
        <div>
          {title && (
            <span>
              <strong>
                <Trans i18nKey={title} />
              </strong>
              <br />
            </span>
          )}
          {errorNumber && `(${errorNumber}) `}
          {rawMessage || <Trans i18nKey={message} />}
        </div>
      </div>
    </ReactstrapAlert>
  );
}
