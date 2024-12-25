import { Trans } from 'react-i18next';
import { SetlistCard } from './SetlistCard';
import type { Setlist } from 'utils/types/setlist';
import { Link } from 'react-router-dom';

export function SetlistList({ setlists, query }: { setlists: Setlist[]; query: string }) {
  if (!Array.isArray(setlists) || setlists.length === 0) {
    return (
      <div className="col-12 text-center my-4">
        <Trans i18nKey="noSetlistsFound" values={{ searchParam: query }}>
          No setlists found for <em>your search query</em>
        </Trans>
      </div>
    );
  }

  return (
    <div className="SetlistList container px-0">
      <div className="row row-cols-1 row-cols-md-2 g-2 g-sm-3 g-lg-4 pt-3">
        {setlists.map((setlist) => (
          <Link key={setlist.id} to={`/scrobble/setlist/view/${setlist.id}`} className="text-decoration-none">
            <SetlistCard setlist={setlist} className={setlist.trackCount === 0 ? 'opacity-50 border-dark' : ''} />
          </Link>
        ))}
      </div>
    </div>
  );
}
