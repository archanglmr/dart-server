'use strict';

import React, {PropTypes} from 'react';
import './DartIcon.scss';


function DartIcon({outlineOnly}) {
  var className = ['dart-icon'];
  if (outlineOnly) {
    className.push('outline');
  }

  return (
      <svg className={className.join(' ')} viewBox="0 0 73 25">
        <path d="M68,23.08l2.4-8.39a2.88,2.88,0,0,0,0-5.55L68,.73a1,1,0,0,0-1-.72H56.81a1,1,0,0,0-.87.5L51.09,9H42.84A3.51,3.51,0,0,0,40.2,7.7H36.64v8.41H40.2a3.48,3.48,0,0,0,2.47-1c.08-.08.14-.17.21-.26h8.22l4.84,8.48a1,1,0,0,0,.16.21,1,1,0,0,0,.71.29H67.07A1,1,0,0,0,68,23.08ZM43.69,12.61V11.2c0-.07,0-.14,0-.22H69.58a1,1,0,0,1,1,.92.93.93,0,0,1-.92.92h-26C43.68,12.76,43.69,12.69,43.69,12.61Z"/>
        <path d="M26.37,16.11V7.7H29.5v8.41Z"/>
        <path d="M17,7.7a3.48,3.48,0,0,0-3.47,3.21H1a1,1,0,1,0,0,2H13.5A3.48,3.48,0,0,0,17,16.11h2.55V7.7Z"/>
        <path d="M31.5,16.11V7.7h3.13v8.41Z"/>
        <path d="M21.52,16.11V7.7h2.85v8.41Z"/>
      </svg>
  );
}

DartIcon.propTypes = {
  outlineOnly: PropTypes.bool.isRequired
};

export default DartIcon;











/////
/////  Icon credit:
/////
/////  <div>Icons made by <a href="http://www.flaticon.com/authors/madebyoliver" title="Madebyoliver">Madebyoliver</a> from <a href="http://www.flaticon.com" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
/////