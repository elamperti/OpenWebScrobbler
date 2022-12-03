import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { Trans } from 'react-i18next';
import { Alert as ReactstrapAlert } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { dismissAlert } from 'store/actions/alertActions';

export default function Alert({ id: alertId, type, errorNumber, title, message, rawMessage, icon }) {
  const [isOpen, setOpenState] = useState(true);
  const dispatch = useDispatch();

  const onClose = () => {
    setOpenState(false);
    setTimeout(() => dismissAlert(dispatch)({ id: alertId }), 1000);
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

Alert.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string,
  errorNumber: PropTypes.number,
  title: PropTypes.string,
  message: PropTypes.string,
  rawMessage: PropTypes.string,
  icon: PropTypes.object,
};
