import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import addDays from 'date-fns/addDays';
import subDays from 'date-fns/subDays';
import format from 'date-fns/format';

import { Input, InputGroup, InputGroupText, Modal, ModalBody, ModalHeader } from 'reactstrap';
import TimeKeeper from 'react-timekeeper';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faClock } from '@fortawesome/free-regular-svg-icons';

import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

import './DateTimePicker.scss';

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

  if (!visible) return null;

  const minDate = subDays(new Date(), 14);
  const maxDate = addDays(new Date(), 1);

  const handleDateChange = (timestamp) => {
    // Restore hours and minutes
    timestamp.setHours(value.getHours());
    timestamp.setMinutes(value.getMinutes());
    timestamp.setSeconds(value.getSeconds());

    onChange(timestamp);
  };

  // This is almost the same as handleTimeChange, but I've separated it
  // because I'm deprecating react-timekeeper and it will be removed in the future
  const handleTimeInputChange = (e) => {
    const newTime = e.target.value;
    const [hour, minute, seconds] = newTime.split(':');

    const timestamp = new Date(value);
    timestamp.setHours(hour);
    timestamp.setMinutes(minute);
    timestamp.setSeconds(seconds);

    if (timestamp > maxDate) {
      e.value = value;
    } else {
      onChange(timestamp);
    }
  };

  const handleTimeChange = (newTime) => {
    const timestamp = new Date(value);
    timestamp.setHours(newTime.hour);
    timestamp.setMinutes(newTime.minute);
    timestamp.setSeconds(0);
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
          <InputGroupText id="TimePickerInputGroupClock" onClick={showTimePicker}>
            <FontAwesomeIcon icon={faClock} />
          </InputGroupText>
          <Input
            id="TimePicker"
            className="text-center"
            type="time"
            bsSize="sm"
            pattern="^([01]?\d|2[0-3]):[0-5]\d$"
            onChange={handleTimeInputChange}
            value={format(value, 'HH:mm:ss')}
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
