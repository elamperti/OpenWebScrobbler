import React from 'react';
// import { useSelector } from 'react-redux';
import { Navigate, Route, Routes as Switch } from 'react-router-dom';

import Home from 'domains/home';
import PrivateRoute from 'components/PrivateRoute';
import { ScrobbleSong } from './domains/scrobbleSong';
import {
  ScrobbleAlbumSearch,
  ScrobbleArtistResults,
  ScrobbleAlbumResults,
  ScrobbleAlbumTracklist,
} from 'domains/scrobbleAlbum';
import { ScrobbleUserSearch, ScrobbleUserResults } from './domains/scrobbleUser';

// import Spinner from 'components/Spinner';

export default function Routes() {
  // ToDo: fix this to avoid the eternal spinner of death
  // const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  // const settingsLoaded = useSelector((state) => state.settings.settingsLoaded);

  // if (isLoggedIn === null || (isLoggedIn && !settingsLoaded)) {
  //   // ToDo: use suspense
  //   return <Spinner />;
  // }

  return (
    <Switch>
      <Route exact path="/scrobble/song" element={<ScrobbleSong />} />
      <Route exact path="/scrobble/album" element={<PrivateRoute using={ScrobbleAlbumSearch} />} />
      <Route exact path="/scrobble/album/search/:albumName" element={<PrivateRoute using={ScrobbleAlbumResults} />} />
      <Route path="/scrobble/artist">
        <Route exact path=":artistName" element={<PrivateRoute using={ScrobbleArtistResults} />} />
        <Route exact path="mbid/:mbid" element={<PrivateRoute using={ScrobbleArtistResults} />} />
        <Route exact path="dsid/:discogsId" element={<PrivateRoute using={ScrobbleArtistResults} />} />
      </Route>
      <Route path="/scrobble/album/view">
        <Route exact path="mbid/:albumId" element={<PrivateRoute using={ScrobbleAlbumTracklist} />} />
        <Route exact path="dsid/:discogsId" element={<PrivateRoute using={ScrobbleAlbumTracklist} />} />
        <Route exact path=":artist/:albumName" element={<PrivateRoute using={ScrobbleAlbumTracklist} />} />
      </Route>
      <Route exact path="/scrobble/user" element={<PrivateRoute using={ScrobbleUserSearch} />} />
      <Route exact path="/scrobble/user/:username" element={<PrivateRoute using={ScrobbleUserResults} />} />

      <Route exact path="/" element={<Home />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Switch>
  );
}
