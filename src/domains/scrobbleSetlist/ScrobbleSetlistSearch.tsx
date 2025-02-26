import ReactGA from 'react-ga-neo';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import SearchForm from 'components/SearchForm';

export function extractSetlistID(setlistUrl: string): string | null {
  return setlistUrl.match(/([a-zA-Z0-9]+)(?=\.htm)/)?.[0] ?? null;
}

export function ScrobbleSetlistSearch() {
  const navigate = useNavigate();
  const validator = (setlistUrl) => setlistUrl.trim().length > 2;
  const { t } = useTranslation();

  const onSearch = (query) => {
    ReactGA.event({
      category: 'Interactions',
      action: 'Search setlist',
    });
    const setlistId = extractSetlistID(query);

    if (setlistId) {
      navigate(`/scrobble/setlist/view/${setlistId}`);
    } else {
      navigate(`/scrobble/setlist/search/${query}`, {
        state: {
          query,
        },
      });
    }
  };

  return (
    <div>
      <h1>Scrobble Setlist</h1>
      <p>
        <Trans i18nKey="searchSetlistPrompt">Search by artist name or paste a setlist.fm link</Trans>
      </p>
      <SearchForm
        searchCopy={t('search')}
        onSearch={onSearch}
        ariaLabel="Setlist"
        id="setlistToSearch"
        validator={validator}
      ></SearchForm>
    </div>
  );
}
