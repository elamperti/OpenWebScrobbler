import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation, Trans } from 'react-i18next';
import ReactGA from 'react-ga';
import get from 'lodash/get';
import hasIn from 'lodash/hasIn';

import {
  Button,
  CustomInput,
  Row,
} from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faHistory,
  faSync,
  faUserFriends,
} from '@fortawesome/free-solid-svg-icons';

import { fetchLastfmProfileHistory, fetchLastfmProfileInfo } from 'store/actions/userActions';
import { setSettings } from 'store/actions/settingsActions';

import UserCard from 'components/UserCard';
import ScrobbleList from 'components/ScrobbleList';
import Avatar from 'components/Avatar';
import Spinner from 'components/Spinner';
import SearchForm from 'components/SearchForm';
import EmptyScrobbleListFiller from 'components/EmptyScrobbleListFiller';

class ScrobbleUser extends Component {
  constructor(props) {
    super(props);

    // ToDo: move this to componentDidMount
    const proposedUser = get(this.props, 'match.params.username', '');

    this.state = {
      userToSearch: proposedUser.substring(0,15),
      userToDisplay: null,
      isLoading: false,
      searchFormView: true,
      inputInvalid: false,
      justFailedSearch: false,
      searchEnabled: proposedUser.length > 1,
    };

    if (proposedUser) {
      if (proposedUser.length < 16) {
        this.search();
      } else {
        this.props.history.push('/scrobble/user');
      }
    }

    this.listRef = React.createRef();

    this.catchEnter = this.catchEnter.bind(this);
    this.goBackToSearch = this.goBackToSearch.bind(this);
    this.search = this.search.bind(this);
    this.searchUser = this.searchUser.bind(this);
    this.toggleOriginalTimestamp = this.toggleOriginalTimestamp.bind(this);
    this.updateFriendUsername = this.updateFriendUsername.bind(this);
  }

  componentDidMount() {
    this.focusSearchInput();
  }

  static getDerivedStateFromProps(props, state) {
    if (!state.searchFormView && !state.isLoading && !props.match.params.username && !!state.userToDisplay) {
        return {
          ...state,
          userToDisplay: null,
          userToSearch: '',
          searchFormView: true,
        };
    }
    return null;
  }

  catchEnter(event) {
    if (event.keyCode === 13 && !this.state.inputInvalid) {
      this.search();
    }
  }

  focusSearchInput() {
    const searchInput = document.getElementById('userToSearch');
    if (searchInput) {
      searchInput.focus();
      searchInput.setSelectionRange(0, searchInput.value.length);
    }
  }

  goBackToSearch() {
    this.setState({
      userToSearch: '',
      searchFormView: true,
      searchEnabled: false,
    }, () => {
      this.props.history.push('/scrobble/user');
      this.focusSearchInput();
    });
  }

  search() {
    this.setState({
      searchEnabled: false,
      isLoading: true,
    });
    if (!this.usernameIsValid(this.state.userToSearch)) return false;
    ReactGA.event({
      category: 'Search',
      action: 'User'
    });
    this.props.fetchLastfmProfileHistory(this.state.userToSearch, {page: 1}, (res, err) => {
      const errNumber = get(err, 'data.error');
      if (errNumber === 6 || errNumber === 17) { // 6: User not found - 17: User has a private profile
        this.setState({
          inputInvalid: true,
          justFailedSearch: true,
          isLoading: false,
        });
        this.focusSearchInput();
      } else {
        let userToDisplay = get(res, 'value.data.recenttracks[@attr].user', this.state.userToSearch);
        this.props.history.push(`/scrobble/user/${userToDisplay}`);
        this.setState({
          searchFormView: false,
          isLoading: false,
          userToSearch: '',
          userToDisplay,
        }, () => {
          if (!hasIn(this.props.user, `profiles['${this.state.userToDisplay}'].avatar`)) {
            this.props.fetchLastfmProfileInfo(this.state.userToDisplay);
          }
        });
      }
    });
  }

  searchUser(username) {
    return () => {
      this.setState({
        userToSearch: username,
      }, () => {
        this.search();
      });
    };
  }

  toggleOriginalTimestamp() {
    this.props.setSettings({
      ...this.props.settings,
      keepOriginalTimestamp: !this.props.settings.keepOriginalTimestamp,
    }, true, true);
  }

  updateFriendUsername(event) {
    const isValid = this.usernameIsValid(event.target.value);

    this.setState({
      userToSearch: event.target.value,
      justFailedSearch: false,
      inputInvalid: event.target.value.length > 1 ? !isValid : false,
      searchEnabled: event.target.value.length > 1 ? isValid : false,
    });
  }

  usernameIsValid(str) {
    // Should be between 2 and 15 characters, begin with a letter and contain only letters, numbers, '_' or '-'
    return !!str.match(/^(?=[a-zA-Z])[a-zA-Z0-9_.-]{2,15}$/);
  }

  render() {
    const sectionHeading = (
      <h2 className={`w-100 ${this.state.searchFormView ? 'mb-3' : 'm-0 d-inline'}`}>
        <FontAwesomeIcon icon={faUserFriends} />{' '}
        <Trans i18nKey="scrobbleFromOtherUser">Scrobble from another user</Trans>
      </h2>
    );
    const searchForm = (
      <SearchForm
        onChange={this.updateFriendUsername}
        onSearch={this.search}
        ariaLabel="Username"
        inputId="userToSearch"
        maxLength={15}
        size={this.state.searchFormView ? 'lg' : 'sm'}
        value={this.state.userToSearch}
        readOnly={this.state.isLoading}
        disableSearch={!this.state.searchEnabled}
        invalid={this.state.inputInvalid}
        feedbackMessage={this.state.justFailedSearch ? 'userNotFound' : 'invalidUsername'}
      />
    );
    let recentUsers;

    if (get(this.props.user, 'recentProfiles', []).length > 0) {
      let recentUsersList = [];
      for (let recentUser of this.props.user.recentProfiles) {
        // ToDo: convert <li> to <a> so users can copy a permalink to a recent search
        recentUsersList.push(
          <li key={recentUser} className="list-group-item" onClick={this.searchUser(recentUser)}>
            <Avatar user={get(this.props.user, `profiles['${recentUser}']`)} size="sm" className="mr-2" />
            {recentUser}
          </li>
        );
      }
      recentUsers = (
        <React.Fragment>
          <h4><Trans i18nKey="recentlySearchedUsers">Searched recently</Trans></h4>
          <ul className="list-group mx-2 recent-users">
            {recentUsersList}
          </ul>
        </React.Fragment>
      )
    }

    if (this.state.searchFormView) {
      return (
        <Row className="flex-lg-grow-1 mt-3">
          <div className="col-12 col-md-10 offset-md-1 col-lg-8 offset-lg-2 col-xl-6 offset-xl-3">
            { sectionHeading }
            <Trans i18nKey="findFriendCopy">Enter a last.fm username to see their last tracks</Trans>:
            { searchForm }
            { this.state.isLoading ? <Spinner /> : recentUsers }
          </div>
        </Row>
      );
    } else {
      let friendScrobbles = (
        <React.Fragment>
          <div className="UserCard-container rect row no-gutters pb-3">
            <div className="col-sm-8 d-flex align-items-middle">
              <UserCard user={get(this.props.user, `profiles['${this.state.userToDisplay}']`)} name={this.state.userToDisplay} isHeading withLinkToProfile />
            </div>
            <div className="col-sm-4 d-flex px-3 mb-2 flex-fill justify-content-sm-end">
              <Button className="align-self-center w-100" onClick={this.searchUser(this.state.userToDisplay)}>
                <FontAwesomeIcon icon={faSync} />{' '}
                <Trans i18nKey="refresh">Refresh</Trans>
              </Button>
            </div>
            <div className="col-12 px-3">
              <CustomInput
                type="checkbox"
                id="keepOriginalTimestamp"
                label={<Trans i18nKey="keepOriginalTimestamp" />}
                checked={this.props.settings.keepOriginalTimestamp}
                onChange={this.toggleOriginalTimestamp}
                inline
              />
            </div>
          </div>
          <div ref={this.listRef} className="ScrobbleList-container with-gradient">
            <ScrobbleList
              compact noMenu
              analyticsEventForScrobbles="Scrobble from user"
              containerRef={this.listRef}
              scrobbles={get(this.props.user, `profiles['${this.state.userToDisplay}'].scrobbles`, [])}
              userToDisplay={this.state.userToDisplay}
            >
              <div className="mt-3 text-center">
                <Trans i18nKey="noSongsScrobbled">This user hasn&apos;t scrobbled anything yet!</Trans>
              </div>
            </ScrobbleList>
          </div>
        </React.Fragment>
      );

      return (
        <div className="flex-lg-grow-1">
          <div className="row mb-3">
            <div className="col-md-8 d-flex align-items-center">
              <Button onClick={this.goBackToSearch} size="sm" className="mr-3">
                <FontAwesomeIcon icon={faChevronLeft} />
              </Button>
              { sectionHeading }
            </div>
            <div className="col-md-4 d-flex align-items-center justify-content-end">
              { searchForm }
            </div>
          </div>
          <div className="row">
            <div className="col-md-7 mb-4">
              { this.state.isLoading ? <Spinner /> : friendScrobbles }
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
        </div>
      );
    }

  }
}

const mapStateToProps = (state) => {
  return {
    localScrobbles: state.scrobbles.list,
    user: state.user,
    settings: state.settings,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchLastfmProfileHistory: fetchLastfmProfileHistory(dispatch),
    fetchLastfmProfileInfo: fetchLastfmProfileInfo(dispatch),
    setSettings: setSettings(dispatch),
  };
}

ScrobbleUser.propTypes = {
  fetchLastfmProfileHistory: PropTypes.func,
  fetchLastfmProfileInfo: PropTypes.func,
  history: PropTypes.object,
  localScrobbles: PropTypes.array,
  setSettings: PropTypes.func,
  settings: PropTypes.shape({
    keepOriginalTimestamp: PropTypes.bool,
  }),
  user: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withTranslation()(ScrobbleUser)
);
