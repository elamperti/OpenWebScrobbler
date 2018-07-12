import React from 'react';
import { PropTypes } from 'prop-types';
import { Tooltip as BSTooltip } from 'reactstrap';

class Tooltip extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  render() {
    return (
      <BSTooltip {...this.props} isOpen={this.state.isOpen} toggle={this.toggle}>
        {this.props.children}
      </BSTooltip>
    );
  }
}

Tooltip.propTypes = {
  target: PropTypes.string.isRequired,
};

export default Tooltip;
