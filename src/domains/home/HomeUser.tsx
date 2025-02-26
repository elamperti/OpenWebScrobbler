import { Row } from 'reactstrap';
import { faCompactDisc, faPencilAlt, faUserFriends } from '@fortawesome/free-solid-svg-icons';

import BigHomeButton from './partials/BigHomeButton';
import SocialNetworksBlock from './partials/SocialNetworksBlock';
import WelcomeBlock from './partials/WelcomeBlock';

export default function Home() {
  return (
    <>
      <div className="jumbotron rounded px-3 px-sm-4 py-3 py-sm-5 py-md-4" data-cy="HomeUser">
        <WelcomeBlock />
        <Row className="d-block d-md-flex justify-content-between">
          <BigHomeButton href="/scrobble/song" icon={faPencilAlt} i18nKey="scrobbleManually" />
          <BigHomeButton href="/scrobble/album" icon={faCompactDisc} i18nKey="scrobbleFromAlbum" />
          <BigHomeButton href="/scrobble/user" icon={faUserFriends} i18nKey="scrobbleFromOtherUser" />
        </Row>
      </div>
      <SocialNetworksBlock />
    </>
  );
}
