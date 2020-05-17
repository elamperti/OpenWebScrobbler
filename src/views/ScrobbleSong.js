import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { Trans } from 'react-i18next';
import ReactGA from 'react-ga';
import get from 'lodash/get';
import hasIn from 'lodash/hasIn';

import {
  Badge,
  Button,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBroom,
  faCompactDisc,
  faHistory,
  faUserAstronaut,
} from '@fortawesome/free-solid-svg-icons';
import {
  faPlayCircle,
} from '@fortawesome/free-regular-svg-icons';

import { clearListOfScrobbles, scrobbleCounterEnabled } from 'store/actions/scrobbleActions';
import { fetchLastfmProfileHistory } from 'store/actions/userActions';

import ScrobbleList from 'components/ScrobbleList';
import SongForm from 'components/SongForm';
import EmptyScrobbleListFiller from 'components/EmptyScrobbleListFiller';

const CONSIDER_STALE_AFTER = 5 * 60 * 1000; // 5 minutes

class ScrobbleSong extends Component {
  constructor(props) {
    super(props);

    this.goToHistoryTab = this.goToHistoryTab.bind(this);
    this.goToProfileTab = this.goToProfileTab.bind(this);
    this.setCloneReceiver = this.setCloneReceiver.bind(this);

    this.state = {
      activeTab: 'history',
      lastHistoryFetch: null,
      profileScrobblesLoading: false,
    };

    if (this.props.unreadScrobbles > 0) {
      this.props.scrobbleCounterEnabled(false);
    }
  }

  goToHistoryTab() {
    if (this.state.activeTab !== 'history') {
      this.props.scrobbleCounterEnabled(false);
      this.setState({
        activeTab: 'history',
      });
      ReactGA.event({
        category: 'Tabs',
        action: 'History',
      });
    }
  }

  goToProfileTab() {
    if (!this.state.profileScrobblesLoading) {
      const listIsProbablyStale = this.state.lastHistoryFetch ? this.state.lastHistoryFetch < new Date(new Date() - CONSIDER_STALE_AFTER) : true;
      if (this.state.activeTab === 'userProfile' || !hasIn(this.props.user, `profiles[${this.props.user.name}].scrobbles`) || listIsProbablyStale) {
        this.setState({
          profileScrobblesLoading: true,
        }, () => {
          this.props.fetchLastfmProfileHistory(this.props.user.name, null, () => {
            this.setState({
              profileScrobblesLoading: false,
              lastHistoryFetch: new Date(),
            });
          });
        });
        ReactGA.event({
          category: 'Interactions',
          action: 'Reload profile history',
        });
      }
    }
    if (this.state.activeTab !== 'userProfile') {
      this.props.scrobbleCounterEnabled(true);
      this.setState({
        activeTab: 'userProfile',
      });
      ReactGA.event({
        category: 'Tabs',
        action: 'My profile',
      });
    }
  }

  setCloneReceiver(func) {
    this.setState({
      cloneReceiver: func,
    });
  }

  render() {
    let clearListButton;
    const hasUsername = !!this.props.user.name;

    if (this.state.activeTab === 'history') {
      if (this.props.localScrobbles.length > 0) {
        clearListButton = (
          <div className="ml-auto d-flex my-auto">
            <Button className="btn-clear" size="sm" color="secondary" onClick={this.props.clearUserList}>
              <FontAwesomeIcon icon={faBroom} className="mr-1" />
              <Trans i18nKey="clearHistory">Clear history</Trans>
            </Button>
          </div>
        );
      }
    }

    return (
      <div className="row flex-lg-grow-1 mt-3">
        <div className="col-md-6 mb-4 SongForm-container">
          <h2 className="mb-sm-4 mb-md-3">
            <FontAwesomeIcon icon={faPlayCircle} />{' '}
            <Trans i18nKey="scrobbleSongs">Scrobble songs</Trans>
          </h2>
          <SongForm exportCloneReceiver={this.setCloneReceiver} />
        </div>
        <div className="col-md-6 SongFormLists-container">
          <Nav tabs>
            <NavItem>
              <NavLink className={this.state.activeTab === 'history' ? 'active' : '' } onClick={this.goToHistoryTab}>
                <FontAwesomeIcon icon={faHistory}/>
                <span className="pl-1 px-2">
                  <Trans i18nKey="history">History</Trans>
                </span>
                { this.props.unreadScrobbles > 0 ? <Badge color="secondary">{this.props.unreadScrobbles}</Badge> : null }
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink disabled={!hasUsername} className={this.state.activeTab === 'userProfile' ? 'active' : '' } onClick={this.goToProfileTab}>
                <FontAwesomeIcon icon={hasUsername ? faUserAstronaut : faCompactDisc} spin={!hasUsername} />
                <span className="pl-2">
                  <Trans i18nKey="yourProfile">Your profile</Trans>
                </span>
              </NavLink>
            </NavItem>
            { clearListButton }
          </Nav>
          <TabContent className="mt-2" activeTab={this.state.activeTab}>
            <TabPane className="ScrobbleList-container" tabId="history">
              <ScrobbleList scrobbles={this.props.localScrobbles} cloneScrobblesTo={this.state.cloneReceiver}>
                <EmptyScrobbleListFiller />
              </ScrobbleList>
            </TabPane>
            <TabPane className="ScrobbleList-container" tabId="userProfile">
              <ScrobbleList
                compact
                scrobbles={get(this.props.user, `profiles[${this.props.user.name}].scrobbles`, [])}
                cloneScrobblesTo={this.state.cloneReceiver}
                loading={this.state.profileScrobblesLoading}
              >
                No scrobbles yet.
              </ScrobbleList>
            </TabPane>
          </TabContent>
        </div>
      </div>
    );
  }
}

ScrobbleSong.propTypes = {
  fetchLastfmProfileHistory: PropTypes.func,
  clearUserList: PropTypes.func,
  scrobbleCounterEnabled: PropTypes.func,
  localScrobbles: PropTypes.array,
  unreadScrobbles: PropTypes.number,
  user: PropTypes.object,
};

const mapStateToProps = (state) => {
  return {
    localScrobbles: state.scrobbles.list,
    unreadScrobbles: state.scrobbles.unreadCount,
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchLastfmProfileHistory: fetchLastfmProfileHistory(dispatch),
    scrobbleCounterEnabled: scrobbleCounterEnabled(dispatch),
    clearUserList: clearListOfScrobbles(dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  ScrobbleSong
);
