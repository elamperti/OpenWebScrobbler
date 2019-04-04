import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import {
  Button,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Row,
} from 'reactstrap';

function catchEnter(props) {
  return (event) => {
    if (event.keyCode === 13 && !props.invalid) {
      props.onSearch();
    }
  }
}

const SearchForm = props => {
  const { t } = useTranslation();
  return (
    <div>
      <Row noGutters className="mt-2">
        <div className="col-12 col-sm-9 pr-sm-3">
          <FormGroup>
            <Label for="title" className="required sr-only">{props.ariaLabel}</Label>
            <Input
              type="text"
              name={props.inputId}
              id={props.inputId}
              bsSize={props.size}
              value={props.value}
              invalid={props.invalid}
              readOnly={props.readOnly}
              onKeyDown={catchEnter(props)}
              onChange={props.onChange}
              maxLength={props.maxLength}
              data-lpignore="true"
            />
            <FormFeedback valid={!props.invalid}>
              {props.feedbackMessage}
            </FormFeedback>
          </FormGroup>
        </div>
        <div className="col-6 offset-6 col-sm-3 offset-sm-0">
          <Button block size={props.size} color="success" onClick={props.onSearch} disabled={props.disableSearch}>
            {t('search')}
          </Button>
        </div>
      </Row>
    </div>
  );
};

SearchForm.defaultProps = {
  size: 'lg',
  disableSearch: false,
  readOnly: false,
  maxLength: null,
};

SearchForm.propTypes = {
  onChange: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  ariaLabel: PropTypes.string.isRequired,
  inputId: PropTypes.string.isRequired,
  maxLength: PropTypes.number,
  size: PropTypes.oneOf(['lg', 'sm']),
  value: PropTypes.string,
  readOnly: PropTypes.bool,
  disableSearch: PropTypes.bool,
  invalid: PropTypes.bool,
  feedbackMessage: PropTypes.string,
};

export default SearchForm;
