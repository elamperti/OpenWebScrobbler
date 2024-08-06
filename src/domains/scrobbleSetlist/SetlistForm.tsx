import { useState } from 'react';
import { Trans } from 'react-i18next';
import { _setlistfmFindSetlist } from 'store/actions/setlistActions';

import { Button, Form, FormGroup, Input, Label } from 'reactstrap';

export function extractSetlistID(setlistUrl: string) {
  const setlistId = setlistUrl.trim().slice(-13, -5);
  return setlistId;
}

export function SetlistForm() {
  const [setlistUrl, setSetlistUrl] = useState('');
  // const [formIsValid, setFormValid] = useState(false);

  const validateForm = () => {
    // setFormValid(setlistUrl.trim().length > 0 && setlistUrl.includes("setlist.fm") && setlistUrl.includes(".html"));
  };

  const parseUrl = () => {
    const setlistId = extractSetlistID(setlistUrl);
    const setlist = _setlistfmFindSetlist(setlistId);
  };
  return (
      <Form className="SetlistForm" data-cy="SetlistForm">
        <FormGroup className="row">
          <Label for="URL" className="col-sm-3 required">
            Setlist URL
          </Label>
          <Input
            onChange={(e) => {
              setSetlistUrl((e.target as HTMLInputElement).value);
              validateForm();
            }
          }>
          </Input>
        </FormGroup>
        <Button
          className="scrobble-button mt-2"
          tabIndex={4}
          color="success"
          onClick={parseUrl}
          data-cy="scrobble-button">
          <Trans i18nKey="scrobble">Scrobble</Trans>!
        </Button>
      </Form>
  );
}
