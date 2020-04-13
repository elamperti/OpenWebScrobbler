import React from 'react'
import PropTypes from 'prop-types'

import Avatar from 'components/Avatar'

import './ArtistCard.css'

const ArtistCard = props => {
  return (
    <div className={`artistCard ${props.className} my-2 py-2 rounded`}>
      <a href={props.artist.url} onClick={props.onClick} className="ml-2 row h-100 align-items-center">
        <Avatar user={props.artist} size="sm" alt={props.artist.name} isArtist />
        <span className="artistCard-name pl-3">{props.artist.name}</span>
      </a>
    </div>
  )
}

ArtistCard.propTypes = {
  artist: PropTypes.object.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
}

ArtistCard.defaultProps = {
  className: '',
}

export default ArtistCard
