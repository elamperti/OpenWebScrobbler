import React from 'react';
// import { unstable_createResource } from 'react-cache';
import { PropTypes } from 'prop-types';
import get from 'lodash/get';

import { LazyLoadImage } from 'react-lazy-load-image-component';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserAstronaut,
} from '@fortawesome/free-solid-svg-icons';

import './Avatar.css';


const Avatar = props => {
  const avatarURL = get(props.user, `avatar[${props.size}]`);
  let iconSize;
  let imgSize;
  let placeholderIcon;

  // const ImageResource = unstable_createResource(source => new Promise(resolve => {
  //   const img = new Image();
  //   img.src = source;
  //   img.onload = resolve;
  // }));

  // const Img = ({src, alt, ...props}) => {
  //   ImageResource.read(src);
  //   return <img src={src} alt={alt} {...props} />;
  // }

  switch (props.size) {
    // case 'xl':
    //   iconSize = '5x';
    //   break;
    case 'lg':
      iconSize = '5x';
      imgSize  = 128;
      break;
    case 'md':
      iconSize = '3x';
      imgSize  = 64;
      break;
    case 'sm':
    default:
      iconSize = '1x';
      imgSize  = 24;
      break;
  }

  placeholderIcon = (
    <div className={`user-avatar user-avatar-${props.size} rounded-circle d-inline-flex justify-content-center align-items-center without-img ${props.className}`}>
      <FontAwesomeIcon icon={faUserAstronaut} size={iconSize} color="white" className="d-block" />
    </div>
  );

  if (avatarURL) {
    return (
      // <React.Suspense fallback={placeholderIcon}>
        <LazyLoadImage
          src={avatarURL}
          alt={props.alt}
          placeholder={placeholderIcon}
          className={`user-avatar user-avatar-${props.size} rounded-circle${props.className ? ' ' + props.className : ''}`}
          width={imgSize}
          height={imgSize}
          // ToDo: implement scrollPosition
        />
      // </React.Suspense>
    );
  } else {
    return placeholderIcon;
  }
};

Avatar.propTypes = {
  className: PropTypes.string,
  user: PropTypes.object.isRequired,
  alt: PropTypes.string.isRequired,
  size: PropTypes.string,
}

Avatar.defaultProps = {
  className: '',
  size: 'sm',
  alt: '',
}

export default Avatar;
