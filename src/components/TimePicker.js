import React from 'react';
import PropTypes from 'prop-types';

import format from 'date-fns/format';

import { Input, InputGroup, InputGroupAddon, Popover, PopoverBody } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';

import './TimePicker.css';

class TimePickerPicker extends React.Component {
  constructor(props) {
    super(props);

    const currentPick = props.options.indexOf(this.props.type === 'number' ? parseInt(props.value) : props.value);

    this.padValue = this.padValue.bind(this);
    this.pick = this.pick.bind(this);
    this.tryToUseManualInput = this.tryToUseManualInput.bind(this);
    this.updateInput = this.updateInput.bind(this);

    this.state = {
      currentPick: currentPick >= 0 ? currentPick : 0,
      options: props.options,
      focused: false,
      value: props.value || props.options[0],
    };
  }

  padValue(val) {
    val = val.toString();
    if (!this.state.focused && this.props.fixedNumberLength) {
      while (val.length < this.props.fixedNumberLength) {
        val = '0' + val;
      }
    }
    return val;
  }

  pick(delta) {
    return () => {
      let newPick = this.state.currentPick + delta;
      if (newPick < 0) {
        newPick = this.state.options.length - 1;
      } else if (newPick >= this.state.options.length) {
        newPick = 0;
      }

      this.setState({
        currentPick: newPick,
        value: this.state.options[newPick],
      });
      this.props.onChange(this.state.options[newPick]);
    };
  }

  tryToUseManualInput(event) {
    const newPick = this.state.options.indexOf(
      this.props.type === 'number' ? parseInt(event.target.value) : event.target.value
    );
    const state = {
      focused: false,
    };

    if (newPick < 0) {
      state.value = this.state.options[this.state.currentPick];
      this.setState(state);
    } else {
      this.setState({
        ...state,
        currentPick: newPick,
        value: this.state.options[newPick],
      });
      this.props.onChange(this.state.options[newPick]);
    }
  }

  updateInput(event) {
    this.setState({
      value: event.target.value,
    });
  }

  render() {
    return (
      <div className="d-flex flex-column ml-1 mr-1">
        <div className="TimePicker-caret text-center mb-1 rounded" onClick={this.pick(1)}>
          <FontAwesomeIcon size="2x" icon={faCaretUp} />
        </div>
        <Input
          className="text-center"
          value={this.padValue(this.state.value)}
          onChange={this.updateInput}
          onFocus={() => this.setState({ focused: true })}
          onBlur={this.tryToUseManualInput}
          readOnly={this.props.readOnly}
        />
        <div className="TimePicker-caret text-center mt-1 rounded" onClick={this.pick(-1)}>
          <FontAwesomeIcon size="2x" icon={faCaretDown} />
        </div>
      </div>
    );
  }
}

TimePickerPicker.defaultProps = {
  type: 'text',
  readOnly: false,
  fixedNumberLength: null,
};

TimePickerPicker.propTypes = {
  fixedNumberLength: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  readOnly: PropTypes.bool,
  type: PropTypes.string,
  value: PropTypes.number,
};

class TimePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...this.getTimeFromValue(props),
      popoverOpen: false,
    };

    this.getTimeFromValue = this.getTimeFromValue.bind(this);
    this.toggle = this.toggle.bind(this);
    this.updateField = this.updateField.bind(this);
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState(this.getTimeFromValue(nextProps));
  }

  // ToDo: handle null value gracefully
  getTimeFromValue(props) {
    let hours = props.value.getHours();
    let isAM = null;

    if (props.use12Hours) {
      isAM = hours < 12;
      hours = hours % 12 || 12;
    }

    return {
      hours,
      minutes: props.value.getMinutes(),
      isAM,
    };
  }

  toggle() {
    this.setState({
      popoverOpen: !this.state.popoverOpen,
    });
  }

  // ToDo: refactor to avoid creating multiple functions
  updateField(fieldname) {
    return (value) => {
      const state = {};
      const newTimestamp = this.props.value;

      if (fieldname === 'isAM') {
        state[fieldname] = !this.state.isAM;
      } else {
        state[fieldname] = value;
      }

      this.setState(state, () => {
        let newHours = parseInt(this.state.hours);

        if (this.props.use12Hours) {
          if (newHours === 12) {
            newHours = 0;
          }
          if (!this.state.isAM) {
            newHours = newHours + 12;
          }
        }
        newTimestamp.setHours(newHours);
        newTimestamp.setMinutes(parseInt(this.state.minutes));

        this.props.onChange(newTimestamp);
      });
    };
  }

  range(min, max) {
    const range = Array.apply(null, { length: max - min + 1 });
    return range.map((val, i) => {
      return i + min;
    });
  }

  render() {
    const possibleHours = this.props.use12Hours ? this.range(1, 12) : this.range(0, 23);
    const possibleMinutes = this.range(0, 59);
    const timeFormat = this.props.use12Hours ? 'h:mm A' : 'H:mm';

    return (
      <div>
        <InputGroup id="TimePickerInputGroup">
          <InputGroupAddon addonType="prepend">
            <span className="input-group-text">
              <FontAwesomeIcon icon={faClock} />
            </span>
          </InputGroupAddon>
          <Input
            id="TimePicker"
            bsSize="sm"
            onClick={this.toggle}
            value={format(this.props.value, timeFormat)}
            readOnly
          />
        </InputGroup>
        <Popover
          placement="bottom"
          isOpen={this.state.popoverOpen}
          toggle={this.toggle}
          fade={false}
          target="TimePicker"
        >
          <PopoverBody className="d-flex">
            <TimePickerPicker
              value={this.state.hours}
              options={possibleHours}
              type="number"
              onChange={this.updateField('hours')}
            />
            <TimePickerPicker
              value={this.state.minutes}
              options={possibleMinutes}
              type="number"
              fixedNumberLength={2}
              onChange={this.updateField('minutes')}
            />
            {this.props.use12Hours && (
              <TimePickerPicker
                value={this.state.isAM ? 'AM' : 'PM'}
                options={['AM', 'PM']}
                readOnly
                onChange={this.updateField('isAM')}
              />
            )}
          </PopoverBody>
        </Popover>
      </div>
    );
  }
}

TimePicker.defaultProps = {
  value: new Date(),
  use12Hours: false,
};

TimePicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  use12Hours: PropTypes.bool,
  value: PropTypes.instanceOf(Date).isRequired, // ToDo: Connect to settings directly and avoid passing through this prop
};

export default TimePicker;
