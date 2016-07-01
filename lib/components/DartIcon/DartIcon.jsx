'use strict';

import React, {PropTypes} from 'react';
import './DartIcon.scss';


function DartIcon({outlineOnly}) {
  var className = ['dart-icon'];
  if (outlineOnly) {
    className.push('outline');
  }

  return (
      <svg className={className.join(' ')} viewBox="0 0 74 26">
        <path d="M68.56,24,71,15.57A2.88,2.88,0,0,0,71,10l-2.4-8.41a1,1,0,0,0-1-.72H57.34a1,1,0,0,0-.87.5L51.63,9.86H43.37a3.51,3.51,0,0,0-2.64-1.28H37.17V17h3.56a3.48,3.48,0,0,0,2.47-1c.08-.08.14-.17.21-.26h8.22l4.84,8.48a1,1,0,0,0,.16.21,1,1,0,0,0,.71.29H67.6A1,1,0,0,0,68.56,24ZM44.23,13.49V12.08c0-.07,0-.14,0-.22H70.12a1,1,0,0,1,1,.92.93.93,0,0,1-.92.92h-26C44.21,13.64,44.23,13.57,44.23,13.49Z" />
        <path d="M26.9,17V8.58H30V17Z" />
        <path d="M17.5,8.58A3.48,3.48,0,0,0,14,11.79H1.53a1,1,0,1,0,0,2H14A3.48,3.48,0,0,0,17.5,17h2.55V8.58Z" />
        <path d="M32,17V8.58h3.13V17Z" />
        <path d="M22.05,17V8.58H24.9V17Z" />
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