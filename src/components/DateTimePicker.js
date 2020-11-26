import React from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import addDays from 'date-fns/add_days';
import subDays from 'date-fns/sub_days';
import format from 'date-fns/format';

import { Input, InputGroup, InputGroupAddon } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons';

import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import TimePicker from 'components/TimePicker';

class DatePickerInput extends React.Component {
  render() {
    return (
      <InputGroup size="sm">
        <InputGroupAddon addonType="prepend">
          <span className="input-group-text">
            <FontAwesomeIcon icon={faCalendarAlt} />
          </span>
        </InputGroupAddon>
        <Input bsSize="sm" {...this.props} />
      </InputGroup>
    );
  }
}

// ToDo: turn into stateless component
class DateTimePicker extends React.Component {
  constructor(props) {
    super(props);

    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
  }

  handleDateChange(timestamp) {
    // Restore hours and minutes
    const previousTimestamp = this.props.value;
    timestamp.setHours(previousTimestamp.getHours());
    timestamp.setMinutes(previousTimestamp.getMinutes());

    this.props.onChange(timestamp);
  }

  handleTimeChange(timestamp) {
    this.props.onChange(timestamp);
  }

  render() {
    const t = this.props.t;
    const minDate = subDays(new Date(), 14);
    const maxDate = addDays(new Date(), 14);

    return (
      <div className={`timestamp row ${!this.props.visible && 'd-none'} ${this.props.className}`}>
        <div className="col-sm-6 mt-3 pr-0">
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
            onDayChange={this.handleDateChange}
            value={this.props.value}
            inputProps={{ readOnly: true }}
          />
        </div>
        <div className="col-sm-6 mt-3">
          <TimePicker
            use12Hours={!!this.props.settings.use12Hours}
            onChange={this.handleTimeChange}
            value={this.props.value}
            format={this.props.settings.use12Hours ? 'hh:mm a' : 'HH:mm'}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    settings: state.settings,
  };
};

const mapDispatchToProps = () => {
  return {};
};

DateTimePicker.propTypes = {
  className: PropTypes.string,
  value: PropTypes.instanceOf(Date).isRequired,
  visible: PropTypes.bool,
};

DateTimePicker.defaultProps = {
  className: '',
  visible: false,
};

DateTimePicker.propTypes = {
  onChange: PropTypes.func,
  t: PropTypes.func,
  settings: PropTypes.shape({
    use12Hours: PropTypes.bool,
  }),
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(DateTimePicker));
