import React from 'react'
import PropTypes from 'prop-types'
import random from 'lodash/random'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/opacity.css'

import './AlbumCard.css'

const AlbumCard = props => {
  let albumCardStyle = {}

  if (props.background) {
    albumCardStyle.backgroundColor = `#A0A0A0`
  } else {
    albumCardStyle.backgroundColor = `hsl(${random(0, 359)},50%,30%)`
  }

  const albumCaption = (props.name &&
    <div className="albumCard-caption px-3 pb-2">
      <strong className="albumCard-title">{props.name}</strong>
      <br />
      <span className="albumCard-artist">{props.artist}</span>
    </div>
  )

  const albumArt = props.background && <LazyLoadImage className='albumArt' src={props.background} alt={props.name} effect="opacity" />

  return (
    <div className={`albumCard ${props.className} ${props.interactive && 'interactive'}`} style={albumCardStyle}>
      {albumArt}
      {albumCaption}
    </div>
  )
}

AlbumCard.propTypes = {
  artist: PropTypes.string,
  background: PropTypes.string.isRequired,
  className: PropTypes.string,
  interactive: PropTypes.bool,
  name: PropTypes.string,
}

AlbumCard.defaultProps = {
  interactive: false,
  className: '',
}

export default AlbumCard
