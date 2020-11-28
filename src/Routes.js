import React from 'react';
// import { useSelector } from 'react-redux';
import { Route, Redirect, Switch } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';

import Home from 'domains/home';
import ScrobbleSong from './views/ScrobbleSong';
import {
  ScrobbleAlbumSearch,
  ScrobbleArtistResults,
  ScrobbleAlbumResults,
  ScrobbleAlbumTracklist,
} from 'domains/scrobbleAlbum';
import ScrobbleUser from './views/ScrobbleUser';

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
      <PrivateRoute exact path="/scrobble/song" component={ScrobbleSong} />
      <PrivateRoute exact path="/scrobble/album" component={ScrobbleAlbumSearch} />
      <PrivateRoute exact path="/scrobble/album/search/:albumName" component={ScrobbleAlbumResults} />
      <PrivateRoute
        exact
        path={['/scrobble/artist/:artistName', '/scrobble/artist/mbid/:mbid', '/scrobble/artist/dsid/:discogsId']}
        component={ScrobbleArtistResults}
      />
      <PrivateRoute
        exact
        path={[
          '/scrobble/album/view/mbid/:albumId',
          '/scrobble/album/view/dsid/:discogsId',
          '/scrobble/album/view/:artist/:albumName',
        ]}
        component={ScrobbleAlbumTracklist}
      />
      <PrivateRoute exact path="/scrobble/user/:username?" component={ScrobbleUser} />
      <Route exact path="/" component={Home} />
      <Redirect to="/" />
    </Switch>
  );
}
