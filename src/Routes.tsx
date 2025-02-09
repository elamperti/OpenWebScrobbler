import { Navigate, Route, Routes as Switch } from 'react-router-dom';

import PrivateRoute from 'components/PrivateRoute';
import Home from 'domains/home';
import { Callback } from 'domains/lastfm/Callback';
import { PatreonCallback } from 'domains/patreon';
import { PlaylistsHome, PlaylistView } from 'domains/playlists';
import {
  ScrobbleAlbumResults,
  ScrobbleAlbumSearch,
  ScrobbleAlbumTracklist,
  ScrobbleArtistResults,
} from 'domains/scrobbleAlbum';
import { ScrobbleSetlistResult, ScrobbleSetlistSearch, ScrobbleSetlistView } from 'domains/scrobbleSetlist';
import { ScrobbleSong } from 'domains/scrobbleSong';
import { ScrobbleUserResults, ScrobbleUserSearch } from 'domains/scrobbleUser';

export default function Routes() {
  return (
    <Switch>
      <Route path="/lastfm/callback" element={<Callback />} />
      <Route path="/scrobble/song" element={<PrivateRoute using={ScrobbleSong} />} />
      <Route path="/scrobble/album" element={<PrivateRoute using={ScrobbleAlbumSearch} />} />
      <Route path="/scrobble/album/search/:albumName" element={<PrivateRoute using={ScrobbleAlbumResults} />} />
      <Route path="/scrobble/artist">
        <Route path=":artistName" element={<PrivateRoute using={ScrobbleArtistResults} />} />
        <Route path="mbid/:mbid" element={<PrivateRoute using={ScrobbleArtistResults} />} />
        <Route path="dsid/:discogsId" element={<PrivateRoute using={ScrobbleArtistResults} />} />
      </Route>
      <Route path="/scrobble/album/view">
        <Route path="mbid/:albumId" element={<PrivateRoute using={ScrobbleAlbumTracklist} />} />
        <Route path="dsid/:discogsId" element={<PrivateRoute using={ScrobbleAlbumTracklist} />} />
        <Route path=":artist/:albumName" element={<PrivateRoute using={ScrobbleAlbumTracklist} />} />
      </Route>
      <Route path="/scrobble/user" element={<PrivateRoute using={ScrobbleUserSearch} />} />
      <Route path="/scrobble/user/:username" element={<PrivateRoute using={ScrobbleUserResults} />} />

      <Route path="/scrobble/setlist" element={<PrivateRoute using={ScrobbleSetlistSearch} />} />
      <Route path="/scrobble/setlist/search/:query" element={<PrivateRoute using={ScrobbleSetlistResult} />} />
      <Route path="/scrobble/setlist/view/:setlistId" element={<PrivateRoute using={ScrobbleSetlistView} />} />

      <Route path="/playlists" element={<PlaylistsHome />} />
      <Route path="/playlists/view/:playlistId" element={<PlaylistView />} />

      <Route path="/patreon/callback" element={<PrivateRoute using={PatreonCallback} />} />
      <Route path="/" element={<Home />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Switch>
  );
}
