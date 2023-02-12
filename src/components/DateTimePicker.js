import React, { useState, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { lazyWithPreload } from 'react-lazy-with-preload';
import { Trans, useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import addDays from 'date-fns/add_days';
import subDays from 'date-fns/sub_days';
import format from 'date-fns/format';

import { Input, InputGroup, InputGroupText, Modal, ModalBody, ModalHeader } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faClock } from '@fortawesome/free-regular-svg-icons';

import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

import './DateTimePicker.scss';

const TimeKeeper = lazyWithPreload(() => import('react-timekeeper'));

function DatePickerInput(props = {}) {
  return (
    <InputGroup size="sm">
      <InputGroupText>
        <FontAwesomeIcon icon={faCalendarAlt} />
      </InputGroupText>
      <Input bsSize="sm" {...props} />
    </InputGroup>
  );
}

export default function DateTimePicker({ className = '', onChange, value, visible = false }) {
  const use12Hours = useSelector((state) => state.settings.use12Hours);
  const { t } = useTranslation();
  const [timePickerModalVisible, setTimePickerModalVisible] = useState(false);
  const showTimePicker = () => setTimePickerModalVisible(true);
  const hideTimePicker = () => setTimePickerModalVisible(false);
  TimeKeeper.preload();

  if (!visible) return null;

  const minDate = subDays(new Date(), 14);
  const maxDate = addDays(new Date(), 1);
  const timeFormat = use12Hours ? 'h:mm A' : 'H:mm';

  const handleDateChange = (timestamp) => {
    // Restore hours and minutes
    timestamp.setHours(value.getHours());
    timestamp.setMinutes(value.getMinutes());

    onChange(timestamp);
  };

  const handleTimeChange = (newTime) => {
    const timestamp = new Date(value);
    timestamp.setHours(newTime.hour);
    timestamp.setMinutes(newTime.minute);
    onChange(timestamp);
  };

  return (
    <div className={`DateTimePicker mb-2 row ${className}`}>
      <div className="col-sm-6 mt-3">
        <DayPickerInput
          dayPickerProps={{
            fromMonth: minDate,
            toMonth: maxDate,
            disabledDays: {
              before: minDate,
              after: maxDate,
            },
          }}
          format={t('dates.format.short')}
          formatDate={format}
          component={DatePickerInput}
          onDayChange={handleDateChange}
          value={value}
          inputProps={{ readOnly: true, className: 'text-center' }}
        />
      </div>
      <div className="col-sm-6 mt-3">
        <InputGroup size="sm" id="TimePickerInputGroup">
          <InputGroupText>
            <FontAwesomeIcon icon={faClock} />
          </InputGroupText>
          <Input
            id="TimePicker"
            className="text-center"
            bsSize="sm"
            onClick={showTimePicker}
            value={format(value, timeFormat)}
            readOnly
          />
        </InputGroup>
        <Modal
          contentClassName="m-auto w-auto"
          isOpen={timePickerModalVisible}
          toggle={hideTimePicker}
          centered={true}
          scrollable={false}
          fade={false}
        >
          <ModalHeader className="border-0 pt-2 pb-1" toggle={hideTimePicker}>
            <Trans i18nKey="customTimestamp">Custom timestamp</Trans>
          </ModalHeader>
          <ModalBody>
            <Suspense
              fallback={
                <div>
                  <Trans i18nKey="loading">Loading...</Trans>
                </div>
              }
            >
              <TimeKeeper
                hour24Mode={!use12Hours}
                time={format(value, 'H:mm')}
                switchToMinuteOnHourSelect={true}
                switchToMinuteOnHourDropdownSelect={true}
                closeOnMinuteSelect={true}
                onChange={handleTimeChange}
                onDoneClick={hideTimePicker}
                doneButton={() => null}
              />
            </Suspense>
          </ModalBody>
        </Modal>
      </div>
    </div>
  );
}

DateTimePicker.propTypes = {
  className: PropTypes.string,
  value: PropTypes.instanceOf(Date).isRequired,
  onChange: PropTypes.func,
  visible: PropTypes.bool,
};
