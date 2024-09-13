import ReactGA from 'react-ga-neo';

import SearchForm from 'components/SearchForm';
// import { SetlistForm } from './SetlistForm';
import { PROVIDER_SETLISTFM, PROVIDER_NAME } from 'Constants';
// import { useState } from 'react';
// import { Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function ScrobbleSetlistSearch() {
  // const [dataProvider, setProvider] = useState<Provider>(PROVIDER_SETLISTFM);
  const navigate = useNavigate();
  const validator = (setlistUrl) =>
    setlistUrl.trim().length > 0 && setlistUrl.includes('setlist.fm') && setlistUrl.includes('.html');
  const { t } = useTranslation();

  const onSearch = (query) => {
    ReactGA.event({
      category: 'Interactions',
      action: 'Search setlist',
    });
    const setlistId = query.trim().slice(-13, -5);

    navigate(`/scrobble/setlist/search/${setlistId}`, {
      state: {
        query,
      },
    });
  };

  return (
    <div>
      <h1>Scrobble Setlist</h1>
      <p>
        Please provide the setlist link from{' '}
        <a href="https://www.setlist.fm" target="_blank" rel="noopener noreferrer">
          Setlilst.fm
        </a>
      </p>
      <SearchForm
        searchCopy={t('searchOnProvider', { dataProvider: PROVIDER_NAME[PROVIDER_SETLISTFM] })}
        onSearch={onSearch}
        ariaLabel="Setlist"
        id="setlistToSearch"
        validator={validator}
      ></SearchForm>
    </div>
  );
}
