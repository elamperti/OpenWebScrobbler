import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

import { LazyLoadImage } from 'react-lazy-load-image-component';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserAstronaut } from '@fortawesome/free-solid-svg-icons';

import './Avatar.css';

const Avatar = (props) => {
  const avatarURL = get(props.user, `avatar[${props.size}]`);
  let iconSize;
  let imgSize;
  let placeholderIcon;

  switch (props.size) {
    // case 'xl':
    //   iconSize = '5x';
    //   break;
    case 'lg':
      iconSize = '5x';
      imgSize = 128;
      break;
    case 'md':
      iconSize = '3x';
      imgSize = 64;
      break;
    case 'sm':
    default:
      iconSize = '1x';
      imgSize = 24;
      break;
  }

  if (avatarURL && !props.isArtist) {
    return (
      <LazyLoadImage
        src={avatarURL}
        alt={props.alt}
        placeholder={placeholderIcon}
        className={`user-avatar user-avatar-${props.size} rounded-circle${
          props.className ? ' ' + props.className : ''
        }`}
        width={imgSize}
        height={imgSize}
        // ToDo: implement scrollPosition
      />
    );
  } else {
    return (
      <div
        className={`user-avatar user-avatar-${props.size} ${props.className} rounded-circle d-inline-flex justify-content-center align-items-center without-img`}
      >
        <FontAwesomeIcon icon={faUserAstronaut} size={iconSize} color="white" className="d-block" />
      </div>
    );
  }
};

Avatar.propTypes = {
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  isArtist: PropTypes.bool,
  size: PropTypes.string,
  user: PropTypes.object.isRequired,
};

Avatar.defaultProps = {
  className: '',
  size: 'sm',
  alt: '',
};

export default Avatar;
