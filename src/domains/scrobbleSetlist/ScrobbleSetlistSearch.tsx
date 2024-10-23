import ReactGA from 'react-ga-neo';

import SearchForm from 'components/SearchForm';
import { PROVIDER_SETLISTFM, PROVIDER_NAME } from 'Constants';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function extractSetlistID(setlistUrl: string) {
  const setlistId = setlistUrl.trim().match(/([a-zA-Z0-9]+)(?=\.html)/)[0];
  return setlistId;
}

export function ScrobbleSetlistSearch() {
  const navigate = useNavigate();
  const validator = (setlistUrl) =>
    setlistUrl.trim().length > 0 && setlistUrl.includes('setlist.fm') && setlistUrl.includes('.html');
  const { t } = useTranslation();

  const onSearch = (query) => {
    ReactGA.event({
      category: 'Interactions',
      action: 'Search setlist',
    });
    const setlistId = extractSetlistID(query);

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
        feedbackMessageKey="invalidSetlistFMUrl"
        ariaLabel="Setlist"
        id="setlistToSearch"
        validator={validator}
      ></SearchForm>
    </div>
  );
}
