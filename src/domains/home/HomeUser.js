import React from 'react'
import { Jumbotron, Row } from 'reactstrap'
import { faCompactDisc, faPencilAlt, faUserFriends } from '@fortawesome/free-solid-svg-icons'
import BigHomeButton from './partials/BigHomeButton'
import SocialNetworksBlock from './partials/SocialNetworksBlock'
import WelcomeBlock from './partials/WelcomeBlock'

export default function Home() {
  return (
    <React.Fragment>
      <Jumbotron data-cy="HomeUser">
        <WelcomeBlock />
        <Row className="d-block d-md-flex justify-content-between">
          <BigHomeButton href="/scrobble/song" icon={faPencilAlt} caption="Scrobble manually" i18nKey="scrobbleManually" />
          <BigHomeButton href="/scrobble/album" icon={faCompactDisc} caption="Scrobble album" i18nKey="scrobbleFromAlbum" />
          <BigHomeButton href="/scrobble/user" icon={faUserFriends} caption="Scrobble from other user" i18nKey="scrobbleFromOtherUser" />
        </Row>
      </Jumbotron>
      <SocialNetworksBlock />
    </React.Fragment>
  )
}
