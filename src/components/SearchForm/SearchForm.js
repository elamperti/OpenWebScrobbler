import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';

import { Button, FormFeedback, FormGroup, Input, Label, Row } from 'reactstrap';

export default function SearchForm({
  ariaLabel,
  feedbackMessageKey,
  id,
  maxLength,
  onSearch,
  readOnly,
  size,
  value,
  validator,
}) {
  const [query, setQuery] = useState(value || '');
  const [isValid, setValidation] = useState(true);

  useEffect(() => {
    const searchInput = document.getElementById(id);

    if (searchInput) {
      searchInput.focus();
      searchInput.setSelectionRange(0, searchInput.value.length);
    }
  }, [id]);

  useEffect(() => {
    setValidation(validator(query));
  }, [validator, query]);

  const callOnSearch = () => {
    onSearch(query);
  };

  const catchEnter = (event) => {
    if (event.keyCode === 13 && isValid) {
      callOnSearch();
    }
  };

  return (
    <div>
      <Row noGutters className="mt-2">
        <div className="col-12 col-sm-9 pr-sm-3">
          <FormGroup>
            <Label for="title" className="required sr-only">
              {ariaLabel}
            </Label>
            <Input
              type="text"
              name={id}
              id={id}
              bsSize={size}
              value={query}
              invalid={query.length > 1 && !isValid}
              readOnly={readOnly}
              onKeyDown={catchEnter}
              onChange={(e) => setQuery(e.target.value)}
              maxLength={maxLength}
              data-lpignore="true"
            />
            <FormFeedback valid={query.length < 1 || isValid}>
              {feedbackMessageKey ? <Trans i18nKey={feedbackMessageKey} /> : 'Unknown error'}
            </FormFeedback>
          </FormGroup>
        </div>
        <div className="col-12 col-sm-3">
          <Button block size={size} color="success" onClick={callOnSearch} disabled={!isValid || query.length < 1}>
            <Trans i18nKey="search">Search</Trans>
          </Button>
        </div>
      </Row>
    </div>
  );
}

SearchForm.defaultProps = {
  disableSearch: false,
  feedbackMessageKey: '',
  maxLength: null,
  readOnly: false,
  size: 'lg',
  validator: () => true,
  value: null,
};

SearchForm.propTypes = {
  ariaLabel: PropTypes.string.isRequired,
  disableSearch: PropTypes.bool,
  feedbackMessageKey: PropTypes.string,
  id: PropTypes.string.isRequired,
  maxLength: PropTypes.number,
  onSearch: PropTypes.func.isRequired,
  readOnly: PropTypes.bool,
  size: PropTypes.oneOf(['lg', 'sm']),
  validator: PropTypes.func,
  value: PropTypes.string,
};
