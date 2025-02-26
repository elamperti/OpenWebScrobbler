import { useEffect, useRef, useState } from 'react';
import { Trans } from 'react-i18next';

import {
  Button,
  DropdownMenu,
  DropdownToggle,
  FormFeedback,
  FormGroup,
  Label,
  Row,
  UncontrolledDropdown,
} from 'reactstrap';

import styles from './SearchForm.module.scss';

import type { ChangeEvent, ReactNode } from 'react';

// ToDo: check and fix any double-renders on change/validation

type SearchFormProps = {
  ariaLabel: string;
  autocomplete?: 'off' | 'on';
  searchOptions?: ReactNode;
  searchCopy: string;
  feedbackMessageKey?: string;
  id: string;
  onSearch: (query: string) => void;
  maxLength?: number | null;
  readOnly?: boolean;
  size?: 'lg' | 'sm';
  validator?: (query: string) => boolean;
  value?: string;
};

export default function SearchForm({
  ariaLabel,
  autocomplete,
  searchOptions,
  searchCopy,
  feedbackMessageKey = '',
  id,
  maxLength = null,
  onSearch,
  readOnly,
  size = 'lg',
  value: initialValue = '',
  validator,
}: SearchFormProps) {
  const [query, setQuery] = useState(initialValue || '');
  const searchInput = useRef<HTMLInputElement>(null);
  const isValid = validator ? validator(query.trim()) : true;

  useEffect(() => {
    if (searchInput) {
      searchInput.current.focus();
      searchInput.current.setSelectionRange(0, searchInput.current.value.length);
    }
  }, [searchInput]);

  const updateQuery = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const callOnSearch = () => {
    onSearch(query);
  };

  const catchEnter = (event) => {
    if (event.keyCode === 13 && isValid) {
      callOnSearch();
    }
  };

  // This is needed to prevent the "invalid" state from showing on first render
  const inputIsInvalid = query.length > 1 && !isValid;
  const disableSearch = !isValid || query.length < 1;

  const searchButton = (
    <Button
      block
      size={size}
      color="success"
      onClick={callOnSearch}
      disabled={disableSearch}
      data-cy="SearchForm-submit"
    >
      {searchCopy}
    </Button>
  );

  return (
    <div>
      <Row className="mt-2 g-0">
        <div className="col-12 col-sm-7 pe-sm-3">
          <FormGroup>
            <Label for="title" className="required sr-only">
              {ariaLabel}
            </Label>
            <input
              type="text"
              name={id}
              id={id}
              ref={searchInput}
              className={`form-control form-control-${size}${inputIsInvalid ? ' is-invalid' : ''}`}
              value={query}
              aria-invalid={inputIsInvalid}
              autoComplete={autocomplete || 'on'}
              readOnly={readOnly}
              onKeyDown={catchEnter}
              onChange={updateQuery}
              maxLength={maxLength}
              data-cy="SearchForm-input"
            />
            <FormFeedback valid={query.length < 1 || isValid} data-cy="SongForm-invalid-feedback">
              {feedbackMessageKey ? <Trans i18nKey={feedbackMessageKey} /> : 'Unknown error'}
            </FormFeedback>
          </FormGroup>
        </div>
        <div className="col-12 col-sm-5">
          {!searchOptions && searchButton}
          {searchOptions && (
            <UncontrolledDropdown group className="w-100" data-cy="SearchForm-dropdown">
              {searchButton}
              <DropdownToggle
                caret
                color="success"
                className={disableSearch ? styles['fake-disabled'] : ''}
                data-cy="SearchForm-dropdown-toggle"
              />
              <DropdownMenu data-cy="SearchForm-dropdown-menu">{searchOptions}</DropdownMenu>
            </UncontrolledDropdown>
          )}
        </div>
      </Row>
    </div>
  );
}
