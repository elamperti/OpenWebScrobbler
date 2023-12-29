import { forwardRef, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import addDays from 'date-fns/addDays';
import subDays from 'date-fns/subDays';
import format from 'date-fns/format';

import { Input, InputGroup, InputGroupText, Modal, ModalBody, ModalHeader } from 'reactstrap';
import TimeKeeper from 'react-timekeeper';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faClock } from '@fortawesome/free-regular-svg-icons';

import { useSettings } from 'hooks/useSettings';

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

interface DateTimePickerProps {
  className?: string;
  onChange: (timestamp: Date) => void;
  value: Date;
  visible?: boolean;
}

export default function DateTimePicker({ className = '', onChange, value, visible = false }: DateTimePickerProps) {
  const { settings } = useSettings();
  const { t } = useTranslation();
  const [timePickerModalVisible, setTimePickerModalVisible] = useState(false);
  const showTimePicker = () => setTimePickerModalVisible(true);
  const hideTimePicker = () => setTimePickerModalVisible(false);
  const minDate = useMemo(() => subDays(new Date(), 14), []);
  const maxDate = useMemo(() => addDays(new Date(), 1), []);

  if (!visible) return null;

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
    try {
      const [hour, minute, seconds] = newTime.split(':');

      const timestamp = new Date(value);
      timestamp.setHours(hour);
      timestamp.setMinutes(minute);
      timestamp.setSeconds(seconds || 0); // iOS may not give us seconds
      timestamp.setMilliseconds(0);

      onChange(timestamp);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(`Invalid time value «${newTime}»`);
    }
  };

  const handleTimeChange = (newTime) => {
    const timestamp = new Date(value);
    timestamp.setHours(newTime.hour);
    timestamp.setMinutes(newTime.minute);
    timestamp.setSeconds(0);
    timestamp.setMilliseconds(0);
    onChange(timestamp);
  };

  return (
    <div className={`DateTimePicker mb-2 row ${className}`} data-cy="DateTimePicker">
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
          formatDate={format as unknown as (date: Date, format: string) => string}
          component={forwardRef(DatePickerInput)}
          onDayChange={handleDateChange}
          value={value}
          inputProps={{ readOnly: true, className: 'text-center', 'data-cy': 'DateTimePicker-date' }}
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
            data-cy="DateTimePicker-time"
            type="time"
            step="1"
            bsSize="sm"
            pattern="^([01]?\d|2[0-3]):[0-5]\d$"
            onInput={handleTimeInputChange}
            value={format(value, 'HH:mm:ss')}
            // invalid={value > maxDate}
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
              hour24Mode={!settings?.use12Hours}
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
