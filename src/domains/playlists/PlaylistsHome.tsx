import { Trans } from 'react-i18next';

export function PlaylistsHome() {
  return (
    <section>
      <h1>
        <Trans i18nKey="myPlaylists">My playlists</Trans>
      </h1>
      <ul>
        {/* Replace with fetched playlists */}
        <li>Playlist #1</li>
        <li>Playlist #2</li>
      </ul>
    </section>
  );
}
