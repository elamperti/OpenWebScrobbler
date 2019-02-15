import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { translate, Trans } from 'react-i18next';
import ReactGA from 'react-ga';
import get from 'lodash/get';
import md5 from 'md5';
import addSeconds from 'date-fns/add_seconds';
import subSeconds from 'date-fns/sub_seconds';

import {
  Alert,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  CustomInput,
  FormGroup,
  Row,
} from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faBolt,
  faChevronLeft,
  faCompactDisc,
  faHistory,
  faQuestionCircle,
  faUser,
} from '@fortawesome/free-solid-svg-icons';

import {
  getAlbum,
  searchAlbums,
} from 'store/actions/albumActions';
import {
  searchArtists,
  searchArtistTopAlbums
} from 'store/actions/artistActions';
import {
  enqueueScrobble,
} from 'store/actions/scrobbleActions';

import AlbumCard from 'components/AlbumCard';
import SearchForm from 'components/SearchForm';
import Spinner from 'components/Spinner';
import ScrobbleList from 'components/ScrobbleList';
import EmptyScrobbleListFiller from 'components/EmptyScrobbleListFiller';
import ArtistCard from 'components/ArtistCard';
import DateTimePicker from 'components/DateTimePicker';

import {
  ALBUM_VIEW_STEP_SEARCH,
  ALBUM_VIEW_STEP_SRP,
  ALBUM_VIEW_STEP_ARTIST,
  ALBUM_VIEW_STEP_TRACKLIST,
  LASTFM_API_RATE_LIMIT,
} from 'Constants';

// Important: if a new property needs to be reset on new searches, map it in resetState()
const initialState = {
  albumOrArtist: '',
  selectedAlbum: null,
  selectedArtist: null,
  mbid: {
    artist: null,
    album: null,
  },
  justFailedSearch: false,
  inputInvalid: false,
  searchEnabled: false,
  albumIsLoading: false,
  albumListIsLoading: false,
  artistListIsLoading: false,
  currentView: ALBUM_VIEW_STEP_SEARCH,
  searchOptions: { // ToDo: implement UI for this options
    byAlbum: true,
    byArtist: true,
  },
  canScrobble: true,
  selectedTracks: [],
  useCustomTimestamp: false,
  customTimestamp: new Date(),
  timestampCopyVisible: false,
};

class ScrobbleAlbum extends Component {
  constructor(props) {
    super(props);

    this.state = initialState;

    this.focusSearchInput = this.focusSearchInput.bind(this);
    this.getAlbum = this.getAlbum.bind(this);
    this.handleTimestampChange = this.handleTimestampChange.bind(this);
    this.resetState = this.resetState.bind(this);
    this.scrobbleSelectedTracks = this.scrobbleSelectedTracks.bind(this);
    this.search = this.search.bind(this);
    this.searchAlbumsByArtist = this.searchAlbumsByArtist.bind(this);
    this.toggleTimestampCopy = this.toggleTimestampCopy.bind(this);
    this.toggleCustomTimestamp = this.toggleCustomTimestamp.bind(this);
    this.toggleSelectedTrack = this.toggleSelectedTrack.bind(this);
    this.updateAlbumOrArtist = this.updateAlbumOrArtist.bind(this);
  }

  focusSearchInput() {
    // ToDo: move this logic to component using hooks w/React 16.8+
    const searchInput = document.getElementById('albumOrArtistToSearch');
    if (searchInput) {
      searchInput.focus();
      searchInput.setSelectionRange(0, searchInput.value.length);
    }
  }

  componentDidMount() {
    this.focusSearchInput();
  }

  // ToDo: Refactor this so all calls use the same function
  getAlbum(album) {
    const albumId = album.mbid || md5(`${album.artist} - ${album.name}`);
    return (e) => {
      if( e.button !== 1 ) { // let middle-click go through
        e.preventDefault();
        this.setState({
          albumIsLoading: true,
          selectedAlbum: album.name,
          currentView: ALBUM_VIEW_STEP_TRACKLIST,
          mbid: {
            ...this.state.mbid,
            album: albumId,
            canScrobble: true,
          }
        }, () => {
          this.props.getAlbum(album, () => {
            this.setState({
              albumIsLoading: false,
              canScrobble: get(this.props.albums, `albumsCache['${albumId}'].tracks`, []).length > 0,
            });
          });
          ReactGA.event({
            category: 'Interactions',
            action: 'Click album'
          });
        });
      }
    }
  }

  handleTimestampChange(newTimestamp) {
    this.setState({
      customTimestamp: newTimestamp,
      canScrobble: true,
    });
  }

  resetState(backToStep) {
    let newState = {
      mbid: this.state.mbid,
    };

    // ToDo: refactor initalState to have step1, step2, ... objects and just spread them here (and in constructor)

    /* eslint-disable no-fallthrough */
    switch(backToStep) {
      default:
      case ALBUM_VIEW_STEP_SEARCH:
        newState.albumOrArtist = initialState.albumOrArtist;
        newState.albumListIsLoading = initialState.albumListIsLoading;
        newState.artistListIsLoading = initialState.artistListIsLoading;
        newState.inputInvalid = initialState.inputInvalid;
        newState.justFailedSearch = initialState.justFailedSearch;
        newState.searchEnabled = initialState.searchEnabled;
        newState.searchOptions = initialState.searchOptions;

      case ALBUM_VIEW_STEP_SRP:
        newState.mbid.artist = initialState.mbid.artist;
        newState.selectedArtist = initialState.selectedArtist;

      case ALBUM_VIEW_STEP_ARTIST:
        newState.albumIsLoading = initialState.albumIsLoading;
        newState.mbid.album = initialState.mbid.album;
        newState.selectedAlbum = initialState.selectedAlbum;

      case ALBUM_VIEW_STEP_TRACKLIST:
        newState.canScrobble = initialState.canScrobble;
        newState.selectedTracks = [];
        newState.useCustomTimestamp = initialState.useCustomTimestamp;
        newState.timestampCopyVisible = initialState.timestampCopyVisible;
    }
    /* eslint-enable no-fallthrough */

    newState.currentView = backToStep;
    this.setState(newState, () => {
      if (backToStep === ALBUM_VIEW_STEP_SEARCH) {
        this.focusSearchInput();
      }
    });

    ReactGA.event({
      category: 'Interactions',
      action: 'Album breadcrumb',
      label: `Step ${backToStep + 1}`,
    });
  }

  scrobbleSelectedTracks() {
    const userHasNotSelectedTracks = this.state.selectedTracks.length < 1;
    const timestampCalculationSubstractsTime = !this.state.useCustomTimestamp;
    const albumName = get(this.props.albums, `albumsCache['${this.state.mbid.album}'].info.name`, '');
    let tracks = get(this.props.albums, `albumsCache['${this.state.mbid.album}'].tracks`, []).slice(0);
    let rollingTimestamp = this.state.useCustomTimestamp ? this.state.customTimestamp : new Date();
    let tracksToScrobble = [];

    if (timestampCalculationSubstractsTime) {
      // When the user specifies a custom timestamp it will be the one of the first track,
      // so we'll be adding track.duration to that starting timestamp. In the other case,
      // when the timestamp is `now`, you've just listened to all those tracks, so the most
      // recent track for you is the last one of the album/selection.
      tracks.reverse();
    }

    for (let track of tracks) {
      if (userHasNotSelectedTracks || this.state.selectedTracks.indexOf(track.uuid) > -1) {
        let newTrack = {
          ...track,
          album: albumName,
          timestamp: rollingTimestamp,
        };

        // Adds the track to the array keeping timestamps chronological
        if (timestampCalculationSubstractsTime) {
          tracksToScrobble.unshift(newTrack);
        } else {
          tracksToScrobble.push(newTrack);
        }

        // Prepare timestamp for next track
        rollingTimestamp = timestampCalculationSubstractsTime ? subSeconds(rollingTimestamp, track.duration) : addSeconds(rollingTimestamp, track.duration);
      }
    }

    this.props.enqueueScrobble(tracksToScrobble);
    this.setState({
      selectedTracks: [],
      canScrobble: this.state.selectedTracks.length > 0,
      timestampCopyVisible: false,
    })
  }

  // ToDo: Try to use the cached info before firing new searches
  search() {
    this.setState({
      albumOrArtist: this.state.albumOrArtist.trim(),
      artistListIsLoading: true,
      albumListIsLoading: true,
      currentView: ALBUM_VIEW_STEP_SRP,
    }, () => {
      this.props.searchAlbums(this.state.albumOrArtist.trim(), null, () => {
        this.setState({
          albumListIsLoading: false,
        });
      });
      setTimeout(() => {
        this.props.searchArtists(this.state.albumOrArtist.trim(), null, () => {
          this.setState({
            artistListIsLoading: false,
          });
        });
      }, LASTFM_API_RATE_LIMIT); // Decouple from searchAlbums if required
      ReactGA.event({
        category: 'Interactions',
        action: 'Search album'
      });
    });
  }

  searchAlbumsByArtist(artist) { // ToDo: Accept/use the artist name as alternative
    return (e) => {
      if( e.button !== 1 ) { // let middle-click go through
        e.preventDefault();
        this.setState({
          albumListIsLoading: true,
          currentView: ALBUM_VIEW_STEP_ARTIST,
          selectedArtist: artist.name,
          mbid: {
            ...this.state.mbid,
            artist: artist.mbid,
          },
        }, () => {
          this.props.searchArtistTopAlbums(artist, () => {
            this.setState({
              albumListIsLoading: false,
            });
          });
          ReactGA.event({
            category: 'Interactions',
            action: 'Search artist'
          });
        });
      }
    }
  }

  toggleCustomTimestamp() {
    if (!this.state.useCustomTimestamp) {
      ReactGA.event({
        category: 'Interactions',
        action: 'Use custom timestamp',
        label: 'Album'
      });
    }

    this.setState({
      canScrobble: true,
      customTimestamp: new Date(),
      useCustomTimestamp: !this.state.useCustomTimestamp,
    });
  }

  toggleSelectedTrack(trackUUID, wasCheckedBefore) {
    let selectedTracks = this.state.selectedTracks;

    if (wasCheckedBefore) {
      selectedTracks = selectedTracks.filter(item => item !== trackUUID);
    } else {
      selectedTracks.push(trackUUID);
    }

    this.setState({
      selectedTracks,
      canScrobble: true,
    });
  }

  toggleTimestampCopy() {
    this.setState({
      timestampCopyVisible: !this.state.timestampCopyVisible,
    });
  }

  updateAlbumOrArtist(event) {
    const isValid = true;

    this.setState({
      albumOrArtist: event.target.value,
      justFailedSearch: false,
      inputInvalid: event.target.value.length > 1 ? !isValid : false,
      searchEnabled: event.target.value.length > 1 ? isValid : false,
    });
  }

  render() {
    const t = this.props.t; // Translations
    const topAlbumsMode = this.state.currentView === ALBUM_VIEW_STEP_ARTIST;

    const renderBreadcrumbNavigation = () => {
      let itemList = [
        <BreadcrumbItem tag="a" href="#" onClick={() => this.resetState(ALBUM_VIEW_STEP_SEARCH)} key={ALBUM_VIEW_STEP_SEARCH}>{t('search')}</BreadcrumbItem>
      ];

      if (this.state.currentView !== ALBUM_VIEW_STEP_SEARCH) {
        itemList.push(
          <BreadcrumbItem tag="a" href="#" onClick={() => this.resetState(ALBUM_VIEW_STEP_SRP)} key={ALBUM_VIEW_STEP_SRP}>
            &quot;{this.state.albumOrArtist}&quot;
          </BreadcrumbItem>
        );
      }

      if (this.state.selectedArtist) {
        itemList.push(
          <BreadcrumbItem tag="a" href="#" onClick={() => this.resetState(ALBUM_VIEW_STEP_ARTIST)} key={ALBUM_VIEW_STEP_ARTIST}>
            <FontAwesomeIcon icon={faUser} /> {this.state.selectedArtist}
          </BreadcrumbItem>
        );
      }

      if (this.state.currentView === ALBUM_VIEW_STEP_TRACKLIST) {
        itemList.push(
          <BreadcrumbItem active key={ALBUM_VIEW_STEP_TRACKLIST}>
            <FontAwesomeIcon icon={faCompactDisc} /> {this.state.selectedAlbum}
            {/* ToDo: add a link to the album's URL */}
          </BreadcrumbItem>
        );
      }

      return (
        <Breadcrumb className="my-3">
          {itemList}
        </Breadcrumb>
      );
    };

    const goBackLink = (toStep) => {
      return (
        <a href="/scrobble/album" onClick={(e) => {e.preventDefault();this.resetState(toStep)}} className="my-2">
          <FontAwesomeIcon icon={faArrowLeft} />{' '}
          <Trans i18nKey="goBack">Go back</Trans>
        </a>
      );
    };

    const sectionHeading = (
      <header>
        <div className="d-flex align-items-center">
          {this.state.currentView !== ALBUM_VIEW_STEP_SEARCH && (
            <Button onClick={() => this.resetState(ALBUM_VIEW_STEP_SEARCH)} size="sm" className="mr-3">
              <FontAwesomeIcon icon={faChevronLeft} />
            </Button>
          )}
          <h2 className={`${this.state.currentView === ALBUM_VIEW_STEP_SEARCH ? 'mb-3' : 'm-0 d-inline'}`}>
            <FontAwesomeIcon icon={faCompactDisc} />{' '}
            <Trans i18nKey="scrobbleAlbum">Scrobble an album</Trans>
          </h2>
        </div>
        { this.state.currentView !== ALBUM_VIEW_STEP_SEARCH && renderBreadcrumbNavigation() }
      </header>
    );

    const boringSpinnerBlock = (
      <div className="col-md-6">
        <Spinner />
      </div>
    );

    let albumSRP;
    let artistSRP;
    let albumPane;

    switch(this.state.currentView) {
      default:
      case ALBUM_VIEW_STEP_SEARCH:
        return (
          <Row className="flex-lg-grow-1 mt-3">
            <div className="col-12 col-md-10 offset-md-1 col-lg-8 offset-lg-2 col-xl-6 offset-xl-3">
              { sectionHeading }
              <Trans i18nKey="findAlbumCopy">Enter an album or artist name</Trans>:
              <SearchForm
                onChange={this.updateAlbumOrArtist}
                onSearch={this.search}
                ariaLabel="Album or artist"
                inputId="albumOrArtistToSearch"
                size="lg"
                value={this.state.albumOrArtist}
                readOnly={this.state.isLoading}
                disableSearch={!this.state.searchEnabled}
                invalid={this.state.inputInvalid}
                feedbackMessage={'Generic error'}
              />
            </div>
          </Row>
        );

      case ALBUM_VIEW_STEP_SRP:
      case ALBUM_VIEW_STEP_ARTIST:
        if (this.state.albumListIsLoading) {
          albumSRP = boringSpinnerBlock;
        } else {
          const isHalfColumn = this.state.searchOptions.byArtist && !topAlbumsMode;
          const albumColSize = isHalfColumn ? 'col-sm-6 col-xl-4' : 'col-sm-6 col-sm-4 col-xl-3';
          const albumsSource = topAlbumsMode ? get(this.props.artists.topAlbums, `[${this.state.mbid.artist}]`, []) : get(this.props.albums.searchCache, `[${this.state.albumOrArtist.toLowerCase()}]`, []);
          let listOfAlbums = [];
          let i = 0;

          if (albumsSource.length > 0) {
            for (let album of albumsSource) {
              listOfAlbums.push(
                <div className={`listOfAlbums ${albumColSize}`} key={i}>
                  <a href={album.url} onClick={this.getAlbum(album)}>
                    <AlbumCard artist={album.artist} name={album.name} background={album.cover} className="mt-4" interactive />
                  </a>
                </div>
              );
              i++;
            }
          } else {
            listOfAlbums = (
              <div className="col-12 text-center my-4">
                <Trans i18nKey="noAlbumsFound" values={{albumOrArtist: this.state.albumOrArtist}}>No albums found for <em>your search query</em></Trans>
                <br />
                { goBackLink(this.state.currentView - 1) }
              </div>
            );
          }

          albumSRP = (
            <div className={isHalfColumn ? 'col-md-6' : ''}>
              <h3 className="mt-3 mb-0">{topAlbumsMode ? t('topAlbumsBy', {nameOfArtist: this.state.selectedArtist}) : t('album', {count: 2})}</h3>
              <Row>
                {listOfAlbums}
              </Row>
            </div>
          );
        }

        if (this.state.artistListIsLoading || topAlbumsMode) {
          artistSRP = boringSpinnerBlock;
        } else {
          const artistColSize = this.state.searchOptions.byAlbum ? 'col-xl-6' : 'col-md-6 col-lg-4 col-xl-3';
          const artistsSource = get(this.props.artists.cache, `[${this.state.albumOrArtist.toLowerCase()}]`, []);
          let listOfArtists = [];
          let i = 0;

          if (artistsSource.length > 0) {
            for (let artist of artistsSource) {
              listOfArtists.push(<ArtistCard artist={artist} onClick={this.searchAlbumsByArtist(artist)} className={artistColSize} key={i} />);
              i++;
            }
          } else {
            listOfArtists = (
              <div className="col-12 text-center my-4">
                <Trans i18nKey="noArtistsFound" values={{albumOrArtist: this.state.albumOrArtist}}>No artists found for <em>your search query</em></Trans>
                <br />
                { goBackLink(ALBUM_VIEW_STEP_SEARCH) }
              </div>
            );
          }

          artistSRP = (
            <div className={this.state.searchOptions.byAlbum ? 'col-md-6' : 'col-12'}>
              <h3 className="mt-3 mb-0">{t('artist', {count: 2})}</h3>
              <Row>
                {listOfArtists}
              </Row>
            </div>
          );
        }

        return (
          <React.Fragment>
            { sectionHeading }
            <Row className="flex-grow-1 justify-content-center align-items-start mb-5">
              {albumSRP}
              {topAlbumsMode || this.state.albumListIsLoading ? null : artistSRP}
            </Row>
          </React.Fragment>
        );

      case ALBUM_VIEW_STEP_TRACKLIST:
        if (this.state.albumIsLoading) {
          albumPane = <Spinner />;
        } else {
          const album = get(this.props.albums, `albumsCache['${this.state.mbid.album}']`, {});
          const albumIsEmpty = get(album, 'tracks', []).length === 0;

          albumPane = (
            <React.Fragment>
              <div className="album-heading row my-2">
                <div className="col-3">
                  <AlbumCard background={album.info.cover} />
                </div>
                <div className="col-9 d-flex flex-column">
                  <div className="album-heading-info flex-grow-1">
                    <h3 className="album-heading-album-name mb-0">{album.info.name}</h3>
                    <div className="album-heading-artist-name">{album.info.artist}</div>
                  </div>
                  <FormGroup className="align-self-end mb-0">
                    <CustomInput inline type="radio" id="useNowTimestamp" name="useCustomTimestamp" label={t('now')} checked={!this.state.useCustomTimestamp} onChange={this.toggleCustomTimestamp} disabled={albumIsEmpty} />
                    <CustomInput inline type="radio" id="useCustomTimestamp" name="useCustomTimestamp" label={t('customTimestamp')} checked={this.state.useCustomTimestamp} onChange={this.toggleCustomTimestamp} disabled={albumIsEmpty} />
                    <FontAwesomeIcon id="timestampInfoIcon" icon={faQuestionCircle} color="var(--gray)" onClick={this.toggleTimestampCopy} />
                  </FormGroup>
                </div>
              </div>
              <DateTimePicker value={this.state.customTimestamp} onChange={this.handleTimestampChange} visible={this.state.useCustomTimestamp} />
              <Alert color="dark" isOpen={this.state.timestampCopyVisible} toggle={this.toggleTimestampCopy} className="text-justify mt-3" fade={false}>
                <Trans i18nKey="albumTimestampLogicDescription" />
              </Alert>
              <div className="row">
                <div className="my-2 col-12 col-sm-9 offset-sm-3 col-lg-6 offset-lg-6">
                  <Button className="w-100 mr-3" color="success" onClick={this.scrobbleSelectedTracks} disabled={!this.state.canScrobble}>
                    {t(this.state.selectedTracks.length > 0 ? 'scrobbleSelected' : 'scrobbleAlbum')}
                  </Button>
                </div>
              </div>
              <ScrobbleList compact isAlbum noMenu
                analyticsEventForScrobbles="Scrobble individual album song"
                scrobbles={get(album, 'tracks', [])}
                onSelect={this.toggleSelectedTrack}
                selected={this.state.selectedTracks}
              >
                <div className="row">
                  <div className="col-12 text-center mt-4">
                    <FontAwesomeIcon icon={faBolt} transform="shrink-8 up-3 right-4 rotate-30" mask={faCompactDisc} size="4x" />
                    <p className="mt-2">
                      <Trans i18nKey="emptyAlbum">This album appears to be empty.</Trans>
                    </p>
                    { goBackLink(ALBUM_VIEW_STEP_SRP) }
                  </div>
                </div>
              </ScrobbleList>
            </React.Fragment>
          );
        }

        return (
          <React.Fragment>
            { sectionHeading }
            <div className="row mb-5">
              <div className="col-md-7 mb-4">
                { this.state.albumIsLoading ? <Spinner /> : albumPane }
              </div>
              <div className="col-md-5">
                <h4>
                  <FontAwesomeIcon icon={faHistory} />{' '}
                  <Trans i18nKey="yourHistory">Your history</Trans>
                </h4>
                <div className="ScrobbleList-container">
                  <ScrobbleList scrobbles={this.props.localScrobbles}>
                    <EmptyScrobbleListFiller />
                  </ScrobbleList>
                </div>
              </div>
            </div>
          </React.Fragment>
        );
    }
  }
}

ScrobbleAlbum.propTypes = {
  fetchLastfmProfileHistory: PropTypes.func,
  fetchLastfmProfileInfo: PropTypes.func,
  localScrobbles: PropTypes.array,
  user: PropTypes.object,
};

const mapStateToProps = (state) => {
  return {
    localScrobbles: state.scrobbles.list,
    user: state.user,
    artists: state.artist,
    albums: state.album,
    settings: state.settings,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    enqueueScrobble: enqueueScrobble(dispatch),
    getAlbum: getAlbum(dispatch),
    searchAlbums: searchAlbums(dispatch),
    searchArtists: searchArtists(dispatch),
    searchArtistTopAlbums: searchArtistTopAlbums(dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  translate(['common'])(ScrobbleAlbum)
);
